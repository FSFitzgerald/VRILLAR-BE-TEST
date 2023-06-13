export default {
  mongodb: {
    name: process.env.DB_NOSQL_NAME || 'f1-results',
    host: process.env.DB_NOSQL_HOST || 'cluster0.ubsayms.mongodb.net',
    usersDB: process.env.DB_NOSQL_USERNAME || 'tria315182000',
    password:
      process.env.DB_NOSQL_PASSWORD ||
      '5ggjoRYyDlZdHZKB',
  }
}