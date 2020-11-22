import { APIGatewayProxyHandler, S3Handler } from 'aws-lambda'
import 'source-map-support/register'

import S3 from 'aws-sdk/clients/s3'
import SQS from 'aws-sdk/clients/sqs'
import csvParser from 'csv-parser'


import { corsHeaders } from './constants/headers'

const BUCKET = 'imported-csv'

export const catalogUpload: APIGatewayProxyHandler = async (event) => {
  const catalogName = event.queryStringParameters.name
  const catalogPath = `uploaded/${catalogName}`
  const s3 = new S3({ region: 'eu-west-1' })
  const params = { 
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
  }

  try{
    const url = await s3.getSignedUrlPromise('putObject', params)
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: url
    }
  } catch(error){
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: error.message,
      }),
    }
  } finally {
    console.log(event)
  }

}

export const catalogParse: S3Handler = (event) => {
  const s3 = new S3({ region: 'eu-west-1' })
  const sqs = new SQS({ region: 'eu-west-1' })
  event.Records.forEach(record => {
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream()

    s3Stream.pipe(csvParser())
      .on('data', (data)=>{
        sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data) 
        }, (err) => console.error('SQS_ERROR', err))
      })
      .on('end', async () =>{
        console.log(`Copy from ${BUCKET}/${record.s3.object.key}`)

        await s3.copyObject({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed')
        }).promise()

        await s3.deleteObject({
          Bucket: BUCKET,
          Key: record.s3.object.key
        }).promise()

        console.log(`Copied into ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`)
      })
  })
}