import { createProduct } from "../createProduct";
import { APIGatewayProxyResult } from 'aws-lambda';
import { corsHeaders } from "../../constants/headers";
import productList from "../../mock/productList.json"
import db from "../../db";

jest.mock('product-service/db', ()=> {
  const module = jest.requireActual('product-service/mock/asyncDBqueryEmulator').default
  return {
    create: jest.fn(module.create)
  }
})

describe('createProduct', ()=>{
  test('Status: 200',async ()=>{
    const {id, ...rest } = productList[0];
    const event = { body: JSON.stringify(rest) }
    const  { headers, statusCode, body } = await <APIGatewayProxyResult>createProduct(event);
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(200);
    const {id: resId, ...resRest } = JSON.parse(body)
    expect(resRest).toMatchObject(rest);
    expect(id).toBeTruthy();
  })
  test('Status: 400',async ()=>{
    const {id, ...rest } = productList[0];
    rest.count = 'STRING_COUNT'
    const event = { body: JSON.stringify(rest) }
    const  { headers, statusCode, body } = await <APIGatewayProxyResult>createProduct(event);
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(400);
    expect(body).toBeTruthy()
  })
  test('Status: 500', async ()=>{
    db.createProduct.mockImplementation(()=>Promise.reject(new Error()))
    const  { headers, statusCode } = await <APIGatewayProxyResult>createProduct();
    expect(headers).toMatchObject(corsHeaders);
    expect(statusCode).toBe(500);
  })
})