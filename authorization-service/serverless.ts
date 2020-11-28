import type { AWS } from '@serverless/typescript'

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
  },
  resources:{
    Outputs:{
      AuthArn:{
        Value:{'Fn::GetAtt':['BasicAuthorizerLambdaFunction', 'Arn']},
        Export: {
          Name: 'AuthArn'
        }
      },
    },
  },
  functions: {
    basicAuthorizer: {
      handler: 'handler.basicAuthorizer',
    }
  }
}

module.exports = serverlessConfiguration
