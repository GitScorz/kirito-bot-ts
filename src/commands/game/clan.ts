import { Args, Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
import Character from "../../schemas/Character";
import Clan from "../../schemas/Clan";
import { ErrorEmbed } from "../../utils/Utils";

export class BotStatsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Join or create a new clan and dominate the Discord!",
      fullCategory: ["game"]
    });
  }

  public async messageRun(message: Message, args: Args): Promise<Message> {
    const user = message.author;

    const char: ICharacter = await Character.findOne({ userId: user.id });
    if (!char) return ErrorEmbed(message.channel, user, "you don't have a character!");

    const option: string = await args.pick('string').catch(() => null);
    const item: string = await args.rest('string').catch(() => null);

    if (!option) {
      if (!char?.clanId) {
        let noClanEmbed = new MessageEmbed()
          .setTitle("Clans")
					.setDescription(`Hey **${user.username}**, it looks like you don't have a clan join one with \`k!clan join <name>\`\n\nYou see all the clans through \`k!clan list\`\nWanna create your own clan do \`k!clan create\``)
					.setColor(BOT_GLOBAL_RGB_COLOR);

				message.channel.send({ embeds: [noClanEmbed] });
      }
    }
  }
}