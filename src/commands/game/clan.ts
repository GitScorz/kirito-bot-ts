import { Args, Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
import Character from "../../schemas/Character";
import Clan from "../../schemas/Clan";
import { BLACKLISTED_WORDS, ErrorEmbed } from "../../utils/Utils";

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

    if (!option) {
      if (!char?.clanId) {
        let noClanEmbed = new MessageEmbed()
          .setTitle("Clans")
					.setDescription(`Hey **${user.username}**, it looks like you don't have a clan join one with \`k!clan join <name>\`\nYou see all the clans through \`k!clan list\`\n\nWanna create your own clan, do \`k!clan create <name>, <description>\`\n:warning: **YOU NEED TO SEPARATE WITH A COMMA!**`)
					.setColor(BOT_GLOBAL_RGB_COLOR);

				return message.channel.send({ embeds: [noClanEmbed] });
      }

      const clan: IClan = await Clan.findOne({ _id: char.clanId });

      let clanEmbed = new MessageEmbed()
        .setTitle("Clans")
        .setDescription(`Your clan is ` + clan.name)
        .setColor(BOT_GLOBAL_RGB_COLOR);

      return message.channel.send({ embeds: [clanEmbed] });
    }

    if (option.toLowerCase() === "create") {
      if (char?.clanId) return ErrorEmbed(message.channel, user, "you already have a clan!");

      const clanData: string = await args.rest('string').catch(() => null);
      if (!clanData) return ErrorEmbed(message.channel, user, "you need to provide a clan name and description!\nDo \`k!clan create <name>, <description>\`\n:warning: **YOU NEED TO SEPARATE WITH A COMMA!**");

      const [clanName, clanDescription] = clanData.split(", ");

      if (!clanName) return ErrorEmbed(message.channel, user, "you need to specify a clan name!");

      if (char.gold < 750) return ErrorEmbed(message.channel, user, "you need **750** <:gold:851858239284969473> to create a clan!");
      if (clanName.length > 18) return ErrorEmbed(message.channel, user, "clan name is too long!");

      const clan = await Clan.findOne({ name: clanName });
      if (clan) return ErrorEmbed(message.channel, user, "that clan already exists!");

      for (let i = 0; i < BLACKLISTED_WORDS.length; i++) {
        if (clanName.toLowerCase().includes(BLACKLISTED_WORDS[i])) {
          return ErrorEmbed(message.channel, user, "your clan name includes a blacklisted word!\nNice try though!");
        }
      }

      if (!clanDescription) return ErrorEmbed(message.channel, user, "you need to specify a clan description!");
      if (clanDescription.length > 80) return ErrorEmbed(message.channel, user, "clan description is too long!");

      try {
        const query: IClan = await Clan.create({
          name: clanName,
          description: clanDescription,
          members: [user.id],
          minimumWins: 0,
          open: true,
          level: 1,
          ownerId: user.id,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });

        await Character.updateOne({ userId: user.id }, { 
          $set: { 
            gold: char.gold - 750,
            clanId: query._id.toString()
          },
        });
      } catch (err) {
        console.log(err);
        return ErrorEmbed(message.channel, user, "something went wrong!");
      }

      let msg = `Your clan \`${clanName}\`has been created!`;
      // msg += "\n\nYou can now invite other members to your clan with \`k!clan invite <user_id>\`";
      msg += `\nYou can now tell your friends to join your clan with \`k!clan join ${clanName}\`.`;
      msg += "\n\nSee your clan stats with \`k!clan stats\` and change the settings with \`k!clan settings\`.";

      const clanEmbed = new MessageEmbed()
        .setTitle("Clan Created!")
        .setDescription(msg)
        .setColor(BOT_GLOBAL_RGB_COLOR)
        .setTimestamp();

      return message.channel.send({ embeds: [clanEmbed] });
    }
  }
}