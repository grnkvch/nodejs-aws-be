import { Client, ClientConfig } from 'pg'
 
const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions: ClientConfig = {
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // to avoid warring in this example
    },
    connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
};

async function connectToDb(cb: (client: Client)=>Promise<any>){
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const result = await cb(client)
    return result
  } catch (err) {
    console.error('Error during database request executing:', err);
    throw err
  } finally {
      client.end(); // manual closing of connection
  }
}

const getAll = () => {
  return connectToDb(async (client)=>{
   const products = await client.query(
  `select p.id, title, description, price, image, count FROM
   products p LEFT join stocks s on p.id=s.product_id`)
   return products.rows
  });
};

const getById = (id: string) => {
  return connectToDb(async (client)=>{
   const products = await client.query(
  `select p.id, title, description, price, image, count FROM 
   products p LEFT join stocks s on p.id=s.product_id 
   where p.id = '${id}'`)
   return products.rows
  });
};

const create = ({
  description,
  price,
  title,
  image,
  count = 0
}) => {
  return connectToDb(async (client)=>{
   const products = await client.query(
      `BEGIN;
      with product as (INSERT INTO products (title, description, price, image) VALUES ('${title}', '${description}', ${price}, '${image}') returning *),
      stock as (insert into stocks (product_id, count) select (select id from product), ${count} as count returning *)
      select 
      product.id,
      product.title,
      product.description,
      product.price,
      product.image,
      stock.count
      from product left join stock on product.id = stock.product_id;
      COMMIT;
      `)
   return products[1].rows[0]
  });
};

export default {
  getAll, getById, create,
}