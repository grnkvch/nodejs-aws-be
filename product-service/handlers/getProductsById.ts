import { APIGatewayProxyHandler } from 'aws-lambda';
import { corsHeaders } from '../constants/headers';
import asyncDBqueryEmulator from '../mock/asyncDBqueryEmulator';

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};
  if(!id) throw ({message: 'Path parameter \'id\' is required', statusCode: 400})

  const product = await asyncDBqueryEmulator.find(id)

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
