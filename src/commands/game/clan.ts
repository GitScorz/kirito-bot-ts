import { Args, Command } from "@sapphire/framework";
import { ButtonInteraction, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { CLAN_MEMBER_LIMIT, BOT_GLOBAL_RGB_COLOR, CLAN_GEM_COST, BOT_SUCCESS_RGB_COLOR, BOT_ERROR_RGB_COLOR } from "../../config/Config";
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

      let msg = `You are in the clan **${clan.name}**\n`;
      msg += `\`\`\`\n${clan.description}\n\`\`\``;
      msg += `\n\nState: ${clan.open ? "\`Open\` <:confirm:964494033177157652>" : "\`Closed\` <:nop:852118537735634965>" }`;
      msg += `\nMembers: \`${clan.members.length}/${CLAN_MEMBER_LIMIT}\` 😊`;
      msg += `\nMinimum Trophies: \`${clan.minimumTrophies}\` 🏆`;
      msg += `\nLevel: \`${clan.level}\` 🏅`;

      if (clan.ownerId === user.id) {
        msg += `\n\nYou can manage your clan with \`k!clan manage\``;
      }

      let clanEmbed = new MessageEmbed()
        .setTitle("Clan Overview")
        .setDescription(msg)
        .setColor(BOT_GLOBAL_RGB_COLOR);

      return message.channel.send({ embeds: [clanEmbed] });
    }

    if (option.toLowerCase() === "create") {
      if (char?.clanId) return ErrorEmbed(message.channel, user, "you are in a clan!");

      const clanData: string = await args.rest('string').catch(() => null);
      if (!clanData) return ErrorEmbed(message.channel, user, "you need to provide a clan name and description!\nDo \`k!clan create <name>, <description>\`\n:warning: **YOU NEED TO SEPARATE WITH A COMMA!**");

      const [clanName, clanDescription] = clanData.split(", ");

      if (!clanName) return ErrorEmbed(message.channel, user, "you need to specify a clan name!");

      if (char.gems < CLAN_GEM_COST) return ErrorEmbed(message.channel, user, `you need **${CLAN_GEM_COST}** <:gem:964979628349485126> to create a clan!`);
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
          minimumTrophies: 0,
          open: true,
          level: 1,
          ownerId: user.id,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });

        await Character.updateOne({ userId: user.id }, { 
          $set: { 
            gems: char.gems - CLAN_GEM_COST,
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
      msg += "\n\nSee your clan stats with \`k!clan\` and manage it with \`k!clan manage\`.";

      const clanEmbed = new MessageEmbed()
        .setTitle("Clan Created!")
        .setDescription(msg)
        .setColor(BOT_GLOBAL_RGB_COLOR)
        .setTimestamp();

      return message.channel.send({ embeds: [clanEmbed] });
    }
    
    if (option.toLowerCase() === "join") {
      if (char?.clanId) return ErrorEmbed(message.channel, user, "you are in a clan already!");

      const clanName: string = await args.rest('string').catch(() => null);
      if (!clanName) return ErrorEmbed(message.channel, user, "you need to specify a clan name!\nSee the clan list with \`k!clan list\`");

      const clan: IClan = await Clan.findOne({ name: clanName });
      if (!clan) return ErrorEmbed(message.channel, user, "that clan doesn't exist make sure you typed right!");

      let wins = char.wins;
      let clanUsers = clan.members.length;
      let clanState = clan.open;
      let clanMinimumTrophies = clan.minimumTrophies;

      if (!clanState) {
        return ErrorEmbed(message.channel, user, "that clan is closed!");
      }

      if (clanUsers === CLAN_MEMBER_LIMIT) {
        return ErrorEmbed(message.channel, user, "that clan is full!");
      }

      if (clanMinimumTrophies > wins) {
        return ErrorEmbed(message.channel, user, "you need `" + clanMinimumTrophies + "` trophies to join that clan!");
      }

      try {
        await Clan.updateOne({ _id: clan._id }, {
          $push: { members: user.id },
        });

        await Character.updateOne({ userId: user.id }, {
          $set: { 
            clanId: clan._id.toString() 
          },
        });

      } catch (err) {
        console.log(err);
        return ErrorEmbed(message.channel, user, "something went wrong!");
      }
      
      const joinEmbed = new MessageEmbed()
        .setTitle("Clan Joined!")
        .setDescription(`You just joined in **${clanName}**, to get an overview of the clan do \`k!clan\``)
        .setColor(BOT_GLOBAL_RGB_COLOR)
      return message.channel.send({ embeds: [joinEmbed] });
    }

    if (option.toLowerCase() === "leave") {
      if (!char?.clanId) return ErrorEmbed(message.channel, user, "you aren't in any clan!");

      const clan: IClan = await Clan.findOne({ _id: char.clanId });
      if (!clan) {  // If clan doesn't exist
        await Character.updateOne({ userId: user.id }, {
          $set: { 
            clanId: null 
          },
        });

        const leaveEmbed = new MessageEmbed()
          .setTitle("Clan Left!")
          .setDescription("You left your clan!")
          .setColor(BOT_SUCCESS_RGB_COLOR);

        return message.channel.send({ embeds: [leaveEmbed] });
      }

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("yes")
          .setStyle('SECONDARY')
          .setEmoji('964494033177157652'),
        new MessageButton()
          .setCustomId('no')
          .setStyle('SECONDARY')
          .setEmoji('852118537735634965'),
      );

      if (clan.ownerId === user.id) {  // If you are clan owner
        if (clan.members.length === 1) { // If clan has only one member
          const leaveEmbed = new MessageEmbed()
            .setTitle("Delete clan?")
            .setDescription("Are you sure you want to leave your clan and delete it?\nThis action cannot be undone!")
            .setColor(BOT_ERROR_RGB_COLOR);

          let msg = await message.channel.send({ embeds: [leaveEmbed], components: [row] });

          const filter = (btnInt: Interaction) => {
            return user.id === btnInt.user.id;
          };
  
          const collector = message.channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 15 * 1000,  // 15 seconds
          });
  
          collector.on('collect', async (i: ButtonInteraction) => {
            i.deferUpdate()
            if (i.customId === 'yes') {
              leaveEmbed.setTitle("Clan Deleted!");
              leaveEmbed.setDescription("You leaved the clan and deleted it!");
              leaveEmbed.setColor(BOT_SUCCESS_RGB_COLOR);
              msg.edit({ embeds: [leaveEmbed] });

              await Character.updateOne({ userId: user.id }, {
                $set: { 
                  clanId: null 
                },
              });

              await Clan.deleteOne({ _id: char.clanId });
            } else {
              leaveEmbed.setTitle("Cancelled!");
              leaveEmbed.setDescription("You cancelled the action!");
              leaveEmbed.setColor(BOT_SUCCESS_RGB_COLOR);
              msg.edit({ embeds: [leaveEmbed] });
            }
          });
        } else {  // If clan has more than one member
          const leaveEmbed = new MessageEmbed()
            .setTitle("Transfer Ownership?")
            .setDescription("Are you sure you want to leave the clan and transfer ownership?\nThis action cannot be undone!")
            .setColor(BOT_ERROR_RGB_COLOR);

          let msg = await message.channel.send({ embeds: [leaveEmbed], components: [row] });

          const filter = (btnInt: Interaction) => {
            return user.id === btnInt.user.id;
          };
  
          const collector = message.channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 15 * 1000,  // 15 seconds
          });
  
          collector.on('collect', async (i: ButtonInteraction) => {
            i.deferUpdate()
            if (i.customId === 'yes') {
              leaveEmbed.setTitle("Clan Left!");
              leaveEmbed.setDescription("You leaved the clan and the ownership has been transfered!");
              leaveEmbed.setColor(BOT_SUCCESS_RGB_COLOR);
              msg.edit({ embeds: [leaveEmbed] });

              for (let i = 0; i < clan.members.length; i++) {
                await Clan.updateOne({ _id: char.clanId }, {
                  $set: {
                    ownerId: clan.members[i]
                  }
                })
              }
    
              await Character.updateOne({ userId: user.id }, {
                $set: {
                  clanId: null,
                },
              });
    
              await Clan.updateOne({ _id: char.clanId }, {
                $pull: { members: user.id },
              });
            } else {
              leaveEmbed.setTitle("Canceled!");
              leaveEmbed.setDescription("You cancelled the action!");
              leaveEmbed.setColor(BOT_SUCCESS_RGB_COLOR);
              msg.edit({ embeds: [leaveEmbed] });
            }
          });
        }
      } else { // If you are a member
        const leaveEmbed = new MessageEmbed()
          .setTitle("Leave Clan?")
          .setDescription("Are you sure you want to leave the clan?")
          .setColor(BOT_ERROR_RGB_COLOR);
        
        let msg = await message.channel.send({ embeds: [leaveEmbed], components: [row] });

        const filter = (btnInt: Interaction) => {
          return user.id === btnInt.user.id;
        };

        const collector = message.channel.createMessageComponentCollector({
          filter,
          max: 1,
          time: 15 * 1000,  // 15 seconds
        });

        collector.on('collect', async (i: ButtonInteraction) => {
          i.deferUpdate()
          if (i.customId === 'yes') {
            leaveEmbed.setTitle("Clan Left!");
            leaveEmbed.setDescription("You leaved the clan successfully!");
            leaveEmbed.setColor(BOT_SUCCESS_RGB_COLOR);
            msg.edit({ embeds: [leaveEmbed] });

            await Character.updateOne({ userId: user.id }, {
              $set: { 
                clanId: null 
              },
            });

            await Clan.updateOne({ _id: char.clanId }, {
              $pull: { members: user.id },
            });
          } else {
            leaveEmbed.setTitle("Cancelled!");
            leaveEmbed.setDescription("You cancelled the action!");
            leaveEmbed.setColor(BOT_SUCCESS_RGB_COLOR);
            msg.edit({ embeds: [leaveEmbed] });
          }
        });
      }
    }
  }
}