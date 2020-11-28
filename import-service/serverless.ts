import type { Serverless } from 'serverless/aws'

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
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
        Action: 's3:ListBucket',
        Resource:'arn:aws:s3:::imported-csv' },
      { Effect: 'Allow',
        Action: 's3:*',
        Resource:'arn:aws:s3:::imported-csv/*' },
      { Effect: 'Allow',
        Action: 'sqs:*',
        Resource:'${cf.eu-west-1:product-service-dev.SQSArn}'
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: '${cf.eu-west-1:product-service-dev.SQSUrl}'
    },
  },
  functions: {
    catalogUpload: {
      handler: 'handler.catalogUpload',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            request:{
              parameters:{
                querystrings:{
                  name: true
                }
              }
            }
          },
        }
      ]
    },
    catalogParse: {
      handler: 'handler.catalogParse',
      events: [
        {
          s3: {
            bucket: 'imported-csv',
            event: 's3:ObjectCreated:*',
            rules:[{ prefix: 'uploaded/', suffix:'.csv' }],
            existing: true
          },
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration
