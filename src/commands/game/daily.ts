import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_ERROR_RGB_COLOR, BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
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
    if (!char) return ErrorEmbed(message.channel, user, "you don't have a character!");

    const cooldown = 8.64e+7;
    const health = char.health;
    const now = Date.now();

    const lastClaimed = char.daily?.lastClaimed;
    const claimed = char.daily.claimed;

    if (!claimed) {  // This is the first time claiming
      const randomGold = Math.floor(Math.random() * 100) + 25;
      const healthReward = (health === 100) ? 0 : 25;
      
      let msg = "You claimed your daily reward!";
      msg += `\n\n» **+${randomGold}**<:gold:851858239284969473>`;

      if (healthReward === 25) {
          msg += "\n» **+25**<:life_hp:853288570113359872>";
      }

      const dailyEmbed = new MessageEmbed()
        .setTitle("Daily Reward")
        .setDescription(msg)
        .setColor(BOT_GLOBAL_RGB_COLOR)
        .setTimestamp();

      this.updateChar(user.id, char, randomGold, healthReward, now);

      return message.channel.send({ embeds: [dailyEmbed] });
    } else {
      if (cooldown - (now - lastClaimed) > 0) {  // If the cooldown is still active
        const timeLeft = ParseMS(cooldown - (now - lastClaimed));

        const errorEmbed = new MessageEmbed()
          .setTitle("Daily Reward")
          .setColor(BOT_ERROR_RGB_COLOR)
          .setDescription(`You already claimed the daily reward!\nYou can claim again in \`${timeLeft}\`!`);

        return message.channel.send({ embeds: [errorEmbed] });
      } else {  // If the user has not claimed their daily
          const randomGold = Math.floor(Math.random() * 100) + 25;
          const healthReward = (health === 100) ? 0 : 25;

          let msg = "You claimed your daily reward!";
          msg += `\n\n» **+${randomGold}**<:gold:851858239284969473>`;

          if (healthReward === 25) {
              msg += "\n» **+25**<:life_hp:853288570113359872>";
          } 

          const dailyEmbed = new MessageEmbed()
            .setTitle("Daily Reward")
            .setDescription(msg)
            .setColor(BOT_GLOBAL_RGB_COLOR)
            .setTimestamp();

          message.channel.send({ embeds: [dailyEmbed] });

          this.updateChar(user.id, char, randomGold, healthReward, now);
        }
    }
  }

  private async updateChar(userId: string, char: ICharacter, randomGold: number, healthReward: number, now: number) {
    await Character.updateOne({ userId: userId }, { 
      $set: {
        gold: char.gold + randomGold,
        health: char.health + healthReward,
        daily: {
          lastClaimed: now,
          claimed: true 
        }
      } 
    });
  }
}