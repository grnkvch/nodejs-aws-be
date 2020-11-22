const path = require('path')
const fs = require('fs')

const pathToFile = path.join(__dirname, './productList.json')
const pathToWrite = path.join(__dirname, './otput.csv')
const data = JSON.parse(fs.readFileSync(pathToFile).toString())

function escapeValues(o){
  for(const key in o ){
    if(typeof o[key] === 'string' && o[key].includes(',') ){
      o[key] = '"'+ o[key] + '"'
    }
  }
  return o
}

fs.writeFileSync(pathToWrite, 
  `id,title,description,price,image
${data.map(escapeValues).map(({ description,
    id,
    price,
    title,
    image
  }) => `${id},${title},${description},${price},${image}`)
    .join('\n')}`)
