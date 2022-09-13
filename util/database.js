const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  // 'kliq_demo'
  // ,'postgres'
  // ,'postgres',
  {
    host: process.env.PGHOST,//'localhost',
    dialect: 'postgres'
  }
)

module.exports = sequelize;
