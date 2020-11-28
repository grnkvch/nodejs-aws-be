import {  APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'

const generatePolicy = (
  principalId: string,
  Effect: string,
  Resource: string
) => {
  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument:{
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource
        }
      ]
    }
  }
  return authResponse
}

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = (event, context, callback) => {
  console.log(JSON.stringify(event))
  if (!event.authorizationToken) return callback('Unauthorized')
  try {
    const token = event.authorizationToken.split(' ')[1]
    const [username, password] = Buffer.from(token, 'base64').toString('utf-8').split(':')
    const storedPassword = process.env[username]
    const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow'
    const policy = generatePolicy(token,  effect, event.methodArn,)
    callback(null, policy)
  } catch (err) {
    console.error('catch error. Invalid token', err)
    callback('Unauthorized')
  }
}
