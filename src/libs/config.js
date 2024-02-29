const postgres = {
  database: process.env.DB_NAME,
  username: process.env.USER_NAME,
  password: process.env.USER_PWD,
  params: {
    dialect: "postgres",
    host: "localhost",
    port: 5432,
  },
};

export { postgres };
