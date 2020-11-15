import { APIGatewayProxyHandler, S3Handler } from 'aws-lambda'

import S3 from 'aws-sdk/clients/s3'
import csvParser from 'csv-parser'

import 'source-map-support/register'

const BUCKET = 'imported-csv'

export const catalogUpload: APIGatewayProxyHandler = (event) => {
  const catalogName = event.queryStringParameters.name
  const catalogPath = `uploaded/${catalogName}`
  const s3 = new S3({ region: 'eu-west-1' })
  const params = { 
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
  }

  return new Promise((resolve, reject)=>{
    s3.getSignedUrl('putObject', params, (err, url)=>{
      if(err) return reject(err)

      resolve({
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: url
      })
    })
  })
}

export const catalogParse: S3Handler = (event) => {
  const s3 = new S3({ region: 'eu-west-1' })

  event.Records.forEach(record => {
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream()

    s3Stream.pipe(csvParser())
      .on('data', (data)=>{
        console.log(data)
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