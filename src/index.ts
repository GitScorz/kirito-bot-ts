import { BotClient } from "./client/BotClient";
import * as dotenv from 'dotenv';
dotenv.config();

const client = new BotClient(); // Create a new instance of the bot client
client.login(process.env.TOKEN);  // Use the token from the .ENV file