import { getProductsList } from "../getProductsList";
import { APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders } from "../../constants/headers";
import productList from "../../mock/productList.json"
import asyncDBqueryEmulator from "../../mock/asyncDBqueryEmulator";

jest.mock('product-service/mock/asyncDBqueryEmulator', ()=> {
  const module = jest.requireActual('product-service/mock/asyncDBqueryEmulator').default

  return {
  ...module,
  find: jest.fn(module.find)
  }
})

describe('getProductsList', ()=>{
  test('Status: 200',async ()=>{
    const  { headers, statusCode, body } = await <APIGatewayProxyResult>getProductsList();
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toMatchObject(productList);
  })
  test('Status: 500', async ()=>{
    const errorMessage = 'TEST_ERROR_MESSAGE'
    asyncDBqueryEmulator.find.mockImplementation(()=>Promise.reject(new Error(errorMessage)))
    const  { headers, statusCode, body } = await <APIGatewayProxyResult>getProductsList();
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(500);
    expect(body).toBe(errorMessage);
  })
})