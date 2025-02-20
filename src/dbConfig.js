module.exports = {
  development: {
    username: 'admin',
    password: 'admin',
    database: 'reacjilator',
    host: '127.0.0.1',
    port: 6000,
    dialect: 'postgres',
    define: {
      freezeTableName: true
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    define: {
      freezeTableName: true
    }
  }
}
