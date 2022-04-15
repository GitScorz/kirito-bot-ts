import { Precondition } from "@sapphire/framework";
import type { Message } from "discord.js";
import { BOT_OWNERS } from "../config/Config";

export class OwnerOnlyPrecondition extends Precondition {
  public async run(message: Message) {
    return BOT_OWNERS.includes(message.author.id) 
      ? this.ok()
      : this.error({
        message: "You are not a bot owner and cannot run this command." 
      });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}