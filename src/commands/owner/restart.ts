import { Command } from "@sapphire/framework";
import { Message } from "discord.js";

export class EvalCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Restarts the bot.",
      preconditions: ["OwnerOnly"],
      fullCategory: ["owner"]
    })
  }

  public async messageRun(message: Message) {
    let started = Date.now();
    this.container.logger.info(`[WARNING] - BOT RESTART AS BEEN REQUESTED BY ${message.author.username.toUpperCase()}`);
    
    message.channel.send({ content: ':recycle: ***Restarting...***' }).then(() => this.container.client.destroy())
    .then(() => this.container.client.login(process.env.TOKEN));

    this.container.logger.info(`[INFO] - BOT RESTARTED IN ${Date.now() - started}ms`);
  }
}