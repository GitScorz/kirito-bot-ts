import { SapphireClient } from "@sapphire/framework";
import { BOT_PREFIX } from "../config/config";

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
      presence: {
        status: "online",
        activities: [ 
          {
            type: "WATCHING",
            name: "v2.0.0"
          }
        ]
      }
    });
  }  // end constructor

  public override login(token?: string): Promise<string> {
    return super.login(token);
  }  // Override the login method to use the token from the config file
}