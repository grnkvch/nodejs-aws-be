import productList from '../mock/productList.json';
import { v4 as uuidv4 } from 'uuid';

type responseType = {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
  image: string;
}

class AsyncDBQueryEmulator{
  find(id?: string){
    let response: responseType | responseType[] = productList;
    if(id){
      response = productList.find((item)=>item.id === id)
    }
    return Promise.resolve(response)
  }
  create({
    count,
    description,
    price,
    title,
    image,
  }: Omit<responseType, 'id'>): Promise<responseType>{
    return Promise.resolve({
      id: uuidv4(),
      count,
      description,
      price,
      title,
      image,
    })
  }
}

export default new AsyncDBQueryEmulator()