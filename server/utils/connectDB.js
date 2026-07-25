// import mongoose from "mongoose";

// const dbConnection = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`✅ Database Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ DB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default dbConnection;
import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    // If we are already connected, don't try again
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    // Skip real connection if we are in test mode (setup.js handles that)
    if (process.env.NODE_ENV === "test") {
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    // Only exit in production/dev. In tests, we want to see the failure.
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  }
};

export default dbConnection;