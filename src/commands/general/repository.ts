import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_INVISIBLE_RGB_COLOR } from "../../config/Config";

export class DailyCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["repo", "github", "src"],
      description: "Get your daily reward!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    const embed = new MessageEmbed().setAuthor({ 
      name: "Kirito's repository", 
      iconURL: this.container.client.user.displayAvatarURL({ format: "png", dynamic: true })
    })
    .setDescription(`[**Click here to go to the repository**](https://github.com/GitScorz/kirito-bot-ts)`)
    .setColor(BOT_INVISIBLE_RGB_COLOR);
    
    return message.channel.send({ embeds: [embed] });
  }
}