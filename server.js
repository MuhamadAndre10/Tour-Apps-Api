const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.info(err.name, err.message);
  console.info('UNHANDLE EXCEPTION! Shutting down server');
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info('DB connection successful!');
  });

//* START SERVER
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.info(`app running on port ${port}`);
});

// handler all error code async
process.on('unhandledRejection', (err) => {
  console.info(err.name, err.message);
  console.info('UNHANDLE REJECTION! Shutting down server');
  server.close(() => {
    process.exit(1);
  });
});
