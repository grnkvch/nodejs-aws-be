import {  SQSHandler } from 'aws-lambda'
import db from '../db'


export const catalogBatchProcess: SQSHandler = async ({ Records }) => {
  const dbQueries=Records.map( async ({ body }) => {
    return db.create(JSON.parse(body))
  })

  const notifResult = await Promise.allSettled(dbQueries)
  notifResult.forEach(({status, reason}) => 
    status === 'rejected' && console.error('Socket error', reason))
}
