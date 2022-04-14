import { SapphireClient } from "@sapphire/framework";
import { BOT_PREFIX } from "../config/config";
import { Time } from "@sapphire/time-utilities";

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
      },
      defaultCooldown: {
        delay: Time.Second * 1,
        limit: 1,
      }
    });
  }

  public override login(token?: string): Promise<string> {
    return super.login(token);
  }  // Override the login method to use the token from the config file
}