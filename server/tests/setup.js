// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";

// let mongod;

// export const connect = async () => {
//   mongod = await MongoMemoryServer.create();
//   const uri = mongod.getUri();
//   await mongoose.connect(uri);
// };

// export const closeDatabase = async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await mongod.stop();
// };

// export const clearDatabase = async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     await collections[key].deleteMany({});
//   }
// };

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod;

export const connect = async () => {
  // Prevent multiple connections
  if (mongoose.connection.readyState === 0) {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  }
};

export const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
};

export const clearDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};