import { APIGatewayProxyEvent } from 'aws-lambda';

function log(event:APIGatewayProxyEvent) {
  console.log(`[${new Date().toString()}]: ${JSON.stringify(event)}`)
}

export default {
  log
}