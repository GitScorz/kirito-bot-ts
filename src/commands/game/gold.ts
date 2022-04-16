import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
import Character from "../../schemas/Character";
import { ErrorEmbed } from "../../utils/Utils";

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

    const char: ICharacter = await Character.findOne({ userId: user.id });
    if (!char) {
      return ErrorEmbed(message.channel, user, "you don't have a character!");
    }

    const embed = new MessageEmbed()
      .setTitle(`${user.username}'s Gold`)
      .setDescription(`You currently have **${char.gold}** <:gold:851858239284969473>!\nSpend it on items or equipment with \`k!shop\``)
      .setColor(BOT_GLOBAL_RGB_COLOR);
    
    return message.channel.send({ embeds: [embed] });
  }
}