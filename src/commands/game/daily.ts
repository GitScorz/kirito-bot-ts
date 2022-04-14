import { Command } from "@sapphire/framework";
import { Message } from "discord.js";

export class DailyCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Get your daily reward!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    return message.channel.send("sdasd");
  }
}