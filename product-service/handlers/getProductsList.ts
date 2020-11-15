import { APIGatewayProxyHandler } from 'aws-lambda';
import { corsHeaders } from '../constants/headers';
import db from '../db';
import logger from '../logger';

export const getProductsList: APIGatewayProxyHandler = async (event) => {
  try{
    const productList = await db.getAll()

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
  } finally {
    logger.log(event)
  }
}
