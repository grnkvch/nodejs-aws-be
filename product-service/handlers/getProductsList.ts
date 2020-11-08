import { APIGatewayProxyHandler } from 'aws-lambda';
import { corsHeaders } from '../constants/headers';
import asyncDBqueryEmulator from '../mock/asyncDBqueryEmulator';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try{
    const productList = await asyncDBqueryEmulator.find()

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(productList, null, 2),
    };

  } catch (error) {
    return {
      statusCode:error.statusCode || 500,
      headers: corsHeaders,
      body: error.message,
    };
  }
}
