import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR } from "../../config/config";
import Character from "../../schemas/Character";

export class GoldCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["balance", "bal"],
      description: "See you current gold!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    const user = message.author;

    const char = await Character.findOne({ userId: user.id });
    if (!char) {
      return message.channel.send("You don't have a character!");
    }

    const embed = new MessageEmbed()
      .setDescription(`**${user.username}**, you currently have **${char.gold}** gold!`)
      .setColor(BOT_GLOBAL_RGB_COLOR)
    
    return message.channel.send({ embeds: [embed] });
  }
}