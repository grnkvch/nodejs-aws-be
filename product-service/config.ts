const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, './.env')
});

module.exports = {
  PG_HOST:process.env.PG_HOST,
  PG_PORT:process.env.PG_PORT,
  PG_DATABASE:process.env.PG_DATABASE,
  PG_USERNAME:process.env.PG_USERNAME,
  PG_PASSWORD:process.env.PG_PASSWORD,
};
