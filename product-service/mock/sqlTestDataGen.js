const path = require('path');
const fs = require('fs');

const pathToFile = path.join(__dirname, './productList.json')
const pathToWrite = path.join(__dirname, './otput.sql')
const data = JSON.parse(fs.readFileSync(pathToFile).toString())



fs.writeFileSync(pathToWrite, `
 INSERT INTO products (id, title, description, price, image) VALUES 
  ${data.map(({ description,
    id,
    price,
    title,
    image
  }) => (`('${id}', '${title}', '${description}', ${price}, '${image}')`))
  .join(',\n')};

 INSERT INTO stocks (product_id, count) VALUES
 ${data.map(({ 
  count,
  id,
}) => (`('${id}', ${count})`))
.join(',\n')};
`)
