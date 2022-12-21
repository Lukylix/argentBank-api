const mongoose = require("mongoose");
const databaseUrl = process.env.DATABASE_URL || "mongodb://localhost/argentBankDB";

module.exports = async () => {
  try {
    await mongoose.connect(
      databaseUrl,
      process.env.DATABASE_USER && process.env.DATABASE_PASSWORD
        ? {
            authSource: "admin",
            user: process.env.DATABASE_USER,
            pass: process.env.DATABASE_PASSWORD,
          }
        : {}
    );
    console.log("Database successfully connected");
  } catch (error) {
    console.error(`Database Connectivity Error: ${error}`);
    throw new Error(error);
  }
};
