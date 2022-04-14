import { Command } from "@sapphire/framework";
import { Message } from "discord.js";

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["pong", "latency"],
      description: "Pong!",
      fullCategory: ["general"]
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    return message.channel.send(`Pong! Latency is\` ${this.container.client.ws.ping}ms\``);
  }
}