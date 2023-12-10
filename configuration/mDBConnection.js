const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DBCONNECTION.replace(
  "<PASSWORD>",
  process.env.DBPASSWORD
);

const connectingMongoDB = async () => {
  try {
    const connectionEst = await mongoose.connect(DB, {
      useNewUrlParser: true,
    });
    console.log(
      `DataBase connection established at ${connectionEst.connection.host}`
        .magenta.bold
    );
  } catch (err) {
    console.log("FOUND ERROR ->" + err);
  }
};

module.exports = connectingMongoDB;
