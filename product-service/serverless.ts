import type { Serverless } from 'serverless/aws'
const config = require('./config')

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    iamRoleStatements:[
      { Effect: 'Allow',
        Action: 'sqs:*',
        Resource:{'Fn::GetAtt':['SQSQueue', 'Arn']}
      },
      { Effect: 'Allow',
        Action: 'sns:*',
        Resource:{Ref: 'SNSTopic'}
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: config.PG_HOST,
      PG_PORT: config.PG_PORT,
      PG_DATABASE: config.PG_DATABASE,
      PG_USERNAME: config.PG_USERNAME,
      PG_PASSWORD: config.PG_PASSWORD,
      SNS_ARN: {Ref: 'SNSTopic'}
    },
  },
  resources: {
    Outputs:{
      SQSArn:{
        Value:  {'Fn::GetAtt':['SQSQueue', 'Arn']},
        Export:{
          Name: 'SQSArn'
        }
      },
      SQSUrl:{
        Value:  {Ref:'SQSQueue'},
        Export:{
          Name: 'SQSUrl'
        }
      }
    },
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties:{
          Endpoint: 'waynejohn92@gmail.com',
          Protocol: 'email',
          TopicArn: {Ref: 'SNSTopic'}
        }
      }
    }
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'product',
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'product/{productId}'
          }
        },
      ]
    },
    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            cors: true,
            path: 'product'
          }
        },
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {'Fn::GetAtt':['SQSQueue', 'Arn']}
          }
        },
      ]
    }
  }
}

module.exports = serverlessConfiguration
