import { Args, Command } from "@sapphire/framework";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { BOT_ERROR_RGB_COLOR, BOT_GLOBAL_RGB_COLOR, BOT_IDLE_RGB_COLOR, MATCH_UPDATE_INTERVAL, MATCH_UPDATE_TIMES } from "../../config/Config";
import Character from "../../schemas/Character";
import Match from "../../schemas/Match";
import { ErrorEmbed } from "../../utils/Utils";

export class MatchCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["fight", "battle"],
      description: "Battle all over discord to see who's better!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message, args: Args): Promise<Message> {
    const user = message.author;

    const char: ICharacter = await Character.findOne({ userId: user.id });

    if (!char) {
      return ErrorEmbed(message.channel, user, "you don't have a character!");
    }

    const queueLength = (await Match.find({ inMatch: false })).length;

    const option: string = await args.pick('string').catch(() => null);

    if (!option) {
      let msg = "There are `0` users searching for a match!";
      msg += "\n\nTo search for a match use `k!match search`";
      msg += "\nTo join the queue use `k!match join`";
      msg += "\nIf you want to see your stats do `k!profile`";

      const matchmaking = new MessageEmbed()
        .setTitle("Matchmaking")
        .setDescription(msg)
        .setColor(BOT_GLOBAL_RGB_COLOR);
    
      return message.channel.send({ embeds: [matchmaking] });
    }

    if (option.toLowerCase() === "search") {  // Search for a match
      if (char.health < 25) {
        return ErrorEmbed(message.channel, user, "you are too weak to fight!");
      }

      const isOnMatchOrSearching: IMatch = await Match.findOne({ userId: user.id });

      if (isOnMatchOrSearching) {
        return ErrorEmbed(message.channel, user, "you are already on a match or searching for one!");
      }

      let msg = "You are now searching for a match!";
      msg += `\nThere are \`${queueLength}\` users searching for match!`;
      msg += "\nWait till you find an available opponent!";

      const searchMessage = new MessageEmbed()
        .setTitle("Searching for a match 🔍")
        .setDescription(msg)
        .setFooter({ text: "Updates every 10 seconds.." })
        .setColor(BOT_GLOBAL_RGB_COLOR);

      message.channel.send({ embeds: [searchMessage] }).then(async (msg) => {
        const time = Date.now() + (MATCH_UPDATE_TIMES * 10 * 1000);
        const charName = char.name;
        
        await Match.create({  // Regist a new match
          startedSearching: time,
          inMatch: false,
          name: charName,
          userId: user.id,
          msgId: msg.id,
          channelId: message.channel.id
        });

        const searchUpdate = setInterval(async () => {
          const searchingUser: IMatch = await Match.findOne({ userId: user.id });
  
          if (searchingUser === null) {
            return clearInterval(searchUpdate);
          } else {
            if (!searchingUser.inMatch) {
              const startedSearching = searchingUser.startedSearching;

              let timeExceeded = await this.canceled(user.id, startedSearching);

              if (timeExceeded) {
                const timeExceededMsg = new MessageEmbed()
                  .setDescription("Time exceeded, match not found!")
                  .setColor(BOT_ERROR_RGB_COLOR)
                msg.edit({ embeds: [timeExceededMsg] });

                clearInterval(searchUpdate);
                this.removeFromQueue(user.id);
                return;
              }
            }
          }

          if (!searchingUser.inMatch) {
            let updatedQueueLength = (await Match.find({ inMatch: false })).length;;
            let realUsers = updatedQueueLength - 1;

            if (realUsers > 0) {
              const nick = char.name;
              this.searchMatch(user.id, nick, msg.id, message.channel.id);

              setTimeout(() => {
                if (searchingUser.inMatch) {
                  clearInterval(searchUpdate);
                }
              }, 7000);

              return;
            }

            let updatedDesc = "You are now searching for a match!";
            updatedDesc += `\nThere are \`${realUsers}\` users searching for a match!`;
            updatedDesc += "\nWait till you find an available opponent!";

            const updatedMsg = new MessageEmbed()
              .setTitle("Searching for a match 🔍")
              .setColor(BOT_IDLE_RGB_COLOR)
              .setDescription(updatedDesc)
              .setFooter({ text: "To cancel use k!match cancel" });

            msg.edit({ embeds: [updatedMsg] });
          }
        }, MATCH_UPDATE_INTERVAL); // 10 seconds
      });
    }

    if (option.toLowerCase() === "cancel") {  // Cancel search
      const isOnMatchOrSearching: IMatch = await Match.findOne({ userId: user.id });
      if (!isOnMatchOrSearching) return ErrorEmbed(message.channel, user, "you are not searching for a match!");
      this.removeFromQueue(user.id);
      ErrorEmbed(message.channel, user, "you are no longer searching for a match!");
    } 
  }

  private async removeFromQueue(userId: string) {
    await Match.findOneAndDelete({ userId: userId });
  }

  private async searchMatch(userId: string, name: string, msgId: string, channelId: string) {
    const globalMatches = await Match.find({ inMatch: false });
    for (const match of globalMatches) {
      const randomUser = globalMatches[Math.floor(Math.random() * globalMatches.length)];

      if (match.userId !== userId) {
        const userObject: IOponent = {
          id: userId,
          msgId: msgId,
          channelId: channelId,
          name: name,
        };

        const oponentObject: IOponent = {
          id: randomUser.userId,
          msgId: randomUser.msgId,
          channelId: randomUser.channelId,
          name: randomUser.name,
        };

        this.sendMessage(oponentObject, userObject);

        await Match.updateOne({ userId: oponentObject.id }, { inMatch: true });
        await Match.updateOne({ userId: userObject.id }, { inMatch: true });

        this.fight(userObject, oponentObject);

        break;
      }
    }
  }

  private async sendMessage(user: IOponent, oponent: IOponent) {
    const userMessage = new MessageEmbed()
      .setDescription(`:crossed_swords: **Match found!**\nYou are now fighting against: \`${oponent.name}\``)
      .setColor([0, 255, 0]);

    const oponentMessage = new MessageEmbed()
      .setDescription(`:crossed_swords: **Match found!**\nYou are now fighting against: \`${user.name}\``)
      .setColor([0, 255, 0]);

    // rly discord?
    (this.container.client.channels.cache.get(oponent.channelId) as TextChannel).messages.fetch(oponent.msgId).then(msg => msg.edit({ embeds: [oponentMessage] })).catch(() => null);
    (this.container.client.channels.cache.get(user.channelId) as TextChannel).messages.fetch(user.msgId).then(msg => msg.edit({ embeds: [userMessage] })).catch(() => null);
  }

  private async fight(user: IOponent, oponent: IOponent) {
    const userChar: ICharacter = await Character.findOne({ userId: user.id });
    const oponentChar: ICharacter = await Character.findOne({ userId: oponent.id });

    
  }

  private async calcWin() {
    
  }

  private async canceled(userId: string, startedSearching: number): Promise<boolean> {
    const searchingUser = await Match.findOne({ userId: userId });
    const now = Date.now();

    if (!searchingUser || searchingUser.inMatch) return true;

    if (now - startedSearching > MATCH_UPDATE_TIMES * 10 * 1000) {  // If the time is exceeded return true
      return true;
    }

    // if (startedSearching) {
    //   let restante = startedSearching-now;
    //   let falta = Math.floor(restante/1000);
    //   let min = 0;
    //   while (falta > 60) {
    //     falta -= 60;
    //     min++;
    //   }

    //   if (falta < 0 || min < 0) return true;
    // }

    // const searchingUser: IMatch =  await Match.findOne({ userId: userId });
    // let now = Date.now();
    // if (!searchingUser || searchingUser.inMatch) return true;
    
    // if (startedSearching) {
    //   let restante = startedSearching-now;
    //   let falta = Math.floor(restante/1000);
    //   let min = 0;
    //   while (falta > 60) {
    //     falta -= 60;
    //     min++;
    //   }

    //   if (falta < 0 || min < 0) return true;
    // }

    
    return false
  }
}