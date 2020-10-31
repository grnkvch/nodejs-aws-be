import productList from '../mock/productList.json';
 
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
}

export default new AsyncDBQueryEmulator()