import { Args, Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { ErrorEmbed } from "../../utils/utils";
import Character from '../../schemas/Character';
import { BOT_GLOBAL_RGB_COLOR } from "../../config/config";

export class StartCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Start your adventure!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message, args: Args): Promise<Message> {
    const user = message.author;
    let emptyName = false;  // Check if the name is empty

    const char = await Character.findOne({ userId: user.id });

    if (char) {
      return ErrorEmbed(message.channel, user, "You already have a character!");
    }

    let name: any = await args.rest('string').catch(() => {
      emptyName = true;
    });

    if (emptyName) {
      return ErrorEmbed(message.channel, user, "You need to specify a name!");
    }

    const charName = await Character.findOne({ name: name });
    if (charName) {
      return ErrorEmbed(message.channel, user, "That name is already taken!");
    }

    if (name.length > 20) {
      return ErrorEmbed(message.channel, user, "Your name must be 20 characters or less!");
    }


    try {  // Create the character
      Character.create({
        userId: user.id,
        name: name,
        gold: 2000,
        troops: 200,
        health: 100,
        gems: 500,
        alliance: "None",
        potionEffect: "None",
        wins: 0,
        loss: 0,
        matches: 0
      });

      let msg = `Your character is named **${name}**.`;
      msg += `\nYou got **${2000}** gold.`;
      msg += `\nYou got **${200}** troops.`;
      msg += `\nYou got **${500}** gems.`;
      msg += `\nYou can join in an alliance with the command \`k!alliance\`.`;

      const embed = new MessageEmbed()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setTitle("Your character has been created!")
        .setDescription(msg)
        .setColor(BOT_GLOBAL_RGB_COLOR);

      message.channel.send({ embeds: [embed] });
    } catch (err) {  // Catch any errors
      console.error(err);
      ErrorEmbed(message.channel, user, "there was an error while creating your character.")
    }
  }
}