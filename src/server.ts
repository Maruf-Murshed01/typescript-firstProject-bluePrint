import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();


//for asynchronous
process.on('unhandledRejection', () => {

  console.log(`unhandledRejection is Detected, the server is shutting down...!`);

  if (server) {
    server.close(() => {
      process.exit(1);
    })
  }
  process.exit(1);

})

// for syncronous
process.on('uncaughtException', () => {
  console.log(`uncaughtException is Detected, the server is shutting down...!`);
  process.exit(1);
})



// example of uncaughtException
// console.log(x)