import { APIGatewayProxyHandler } from 'aws-lambda';

import { corsHeaders } from '../constants/headers';
import db from '../db';
import logger from '../logger';
import validator from '../validator'

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    const { body = '' } = event;
    const { value, error } = validator.product(body && JSON.parse(body))

    if(error) throw { statusCode: 400, message: error.message }
    const product = await db.create(value)

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
  } finally {
    logger.log(event)
  }
}
