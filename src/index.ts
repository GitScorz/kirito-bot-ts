import { BotClient } from "./client/BotClient";
import * as dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI) // Connect to our database
  .then(() => {
    console.log("Database connection established.");
  })
  .catch((err) => console.error(err));
  

const client = new BotClient(); // Create a new instance of the bot client
client.login(process.env.TOKEN);  // Use the token from the .ENV file