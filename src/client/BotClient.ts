import { container, SapphireClient } from "@sapphire/framework";
import { BOT_PREFIX, BOT_PRESENCE } from "../config/Config";
import { Time } from "@sapphire/time-utilities";
import { Mongoose } from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

export class BotClient extends SapphireClient {
  public constructor() {
    super({
      intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES",
        "GUILD_MEMBERS"
      ],
      partials: [
        "MESSAGE",
        "CHANNEL",
        "GUILD_MEMBER"
      ],
      defaultPrefix: BOT_PREFIX,
      presence: BOT_PRESENCE,
      defaultCooldown: {
        delay: Time.Second * 1,
        limit: 1,
      }
    });
  }

  public override async login(token?: string): Promise<string> {
    console.log(`NodeJS Version: ${process.version}`);

    container.db = new Mongoose();
    await container.db.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connection established.");
    })
    .catch((err) => console.error(err));

    return super.login(token);
  }  // Override the login method to use the token from the config file
}

declare module "@sapphire/pieces" {
  interface Container {
    db: Mongoose;
  }
}