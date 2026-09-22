const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const base = {
  username: process.env.DB_USER || 'taskflow',
  password: process.env.DB_PASSWORD || 'taskflow',
  database: process.env.DB_NAME || 'taskflow',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
}

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test` },
  production: base,
}
