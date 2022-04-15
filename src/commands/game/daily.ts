import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
import Character from "../../schemas/Character";
import { ErrorEmbed, ParseMS } from "../../utils/Utils";

export class DailyCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Get your daily reward!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    const user = message.author;

    const char: ICharacter = await Character.findOne({ userId: user.id });
    if (!char) return ErrorEmbed(message.channel, user, "You don't have a character!");

    const cooldown = 8.64e+7;
    const health = char.health;
    const gold = char.gold;
    const now = Date.now();

    const lastClaimed = char.daily.lastClaimed
    const claimed = char.daily.claimed;

    if (!claimed) {  // This is the first time claiming
      const randomGold = Math.floor(Math.random() * 100) + 25;
      const healthReward = (health === 100) ? 0 : 25;
      
      let msg = "You claimed your daily reward!"
      msg += `\n\n» **+${randomGold}**<:gold:851858239284969473>`

      if (healthReward === 25) {
          msg += "\n» **+25**<:life_hp:853288570113359872>"
      }

      const embed = new MessageEmbed()
        .setAuthor({ 
          name: `Daily Reward`,
          iconURL: user.displayAvatarURL() 
        })
        .setDescription(msg)
        .setColor(BOT_GLOBAL_RGB_COLOR)

      await Character.findOneAndUpdate({ userId: user.id }, { 
        $set: {
          gold: gold + randomGold,
          health: healthReward,
          daily: { 
            lastClaimed: now,
            claimed: true 
          }
        } 
      });

      return message.channel.send({ embeds: [embed] });
    } else {
      if (cooldown - (now - lastClaimed) > 0) {  // If the cooldown is still active
        const timeLeft = ParseMS(cooldown - (now - lastClaimed));

        const embed = new MessageEmbed()
          .setAuthor({ 
            name: `Daily Reward`,
            iconURL: user.displayAvatarURL() 
          })
          .setColor([255, 0, 0])
          .setDescription(`You already claimed the daily reward!\nYou can claim again in \`${timeLeft}\`!`);

        return message.channel.send({ embeds: [embed] });
      } else {  // If the user has not claimed their daily
          const randomGold = Math.floor(Math.random() * 100) + 25;
          const healthReward = (health === 100) ? 0 : 25;

          let msg = "You claimed your daily reward!"
          msg += `\n\n» **+${randomGold}**<:gold:851858239284969473>`

          if (healthReward === 25) {
              msg += "\n» **+25**<:life_hp:853288570113359872>"
          } 

          let embed = new MessageEmbed()
            .setAuthor({ 
              name: `Daily Reward`,
              iconURL: user.displayAvatarURL() 
            })
            .setDescription(msg)
            .setColor(BOT_GLOBAL_RGB_COLOR)

          message.channel.send({ embeds: [embed] });

          await Character.findOneAndUpdate({ userId: user.id }, { 
            $set: {
              gold: gold + randomGold,
              health: healthReward,
              daily: { 
                lastClaimed: now,
                claimed: true 
              }
            } 
          });
      }
    }
  }
}