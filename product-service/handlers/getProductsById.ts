import { APIGatewayProxyHandler } from 'aws-lambda';
import { UUIDv4 } from 'uuid-v4-validator'

import { corsHeaders } from '../constants/headers';
import asyncDBqueryEmulator from '../mock/asyncDBqueryEmulator';

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const { productId } = event.pathParameters || {};
  if(!UUIDv4.validate(productId)) throw ({message: 'Path parameter \'productId\' is invalid', statusCode: 400})

  const product = await asyncDBqueryEmulator.find(productId)

  if(!product) throw ({message: 'Product not found', statusCode: 404})
    return ({
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(product, null, 2),
  })
  } catch (error) {
    return {
      statusCode:error.statusCode || 500,
      headers: corsHeaders,
      body: error.message,
    };
  }
}
