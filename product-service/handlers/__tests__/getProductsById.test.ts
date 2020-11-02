import { getProductsById } from "../getProductsById";
import { APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders } from "../../constants/headers";
import productList from "../../mock/productList.json"
import asyncDBqueryEmulator from "../../mock/asyncDBqueryEmulator";

jest.mock('product-service/mock/asyncDBqueryEmulator', ()=> {
  const { default: module } = jest.requireActual('product-service/mock/asyncDBqueryEmulator')
  return {
  ...module,
  find: jest.fn(module.find)
  }
})

describe('getProductsById', ()=>{
  test('Status: 200',async ()=>{
    const event = { pathParameters: { productId: productList[0].id } }
    const  { headers, statusCode, body } = await <APIGatewayProxyResult>getProductsById(event);
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toMatchObject(productList[0]);
  })
  test('Status: 400',async ()=>{
    const event = { pathParameters: { productId: 'INVALID_ID' } }
    const  { headers, statusCode, body } = await <APIGatewayProxyResult>getProductsById(event);
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(400);
    expect(body).toBe('Path parameter \'productId\' is invalid')
  })
  test('Status: 404', async ()=>{
    const event = { pathParameters: { productId: '20354d7a-e4fe-47af-8ff6-187bca92f3f9' } } // UNKNOWN UUID
    const  { headers, statusCode, body } = await <APIGatewayProxyResult>getProductsById(event);
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(404);
    expect(body).toBe('Product not found');
  })
  test('Status: 500', async ()=>{
    asyncDBqueryEmulator.find.mockImplementation(()=>Promise.reject(new Error()))
    const  { headers, statusCode } = await <APIGatewayProxyResult>getProductsById();
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(500);
  })
})