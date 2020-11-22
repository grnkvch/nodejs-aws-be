import {  SQSHandler } from 'aws-lambda'
import db from '../db'

import SNS from 'aws-sdk/clients/sns'

export const catalogBatchProcess: SQSHandler = async ({ Records }) => {
  const dbQueries=Records.map( async ({ body }) => {
    return db.create(JSON.parse(body))
  })

  const notifResult = await Promise.allSettled(dbQueries)
  const createdProducts = notifResult.reduce((acc, {status, value, reason}) =>{ 
    if(status === 'rejected') console.error('Socket error', reason)
    else acc.push(value)
    return acc
  }, [])
  const sns = new SNS({ region: 'eu-west-1' })
  sns.publish({
    Subject: 'Created products',
    Message: JSON.stringify(createdProducts),
    TopicArn: process.env.SNS_ARN
  },(e)=>{
    if(e) console.error(e)
    console.log('Email successfully sent')
  })
}
