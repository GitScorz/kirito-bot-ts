import { Args, Command } from "@sapphire/framework";
import { Message } from "discord.js";
import { ErrorEmbed } from "../../utils/utils";
import Character from '../../schemas/Character';

export class StartCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Start your adventure!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message, args: Args): Promise<Message> {
    let user = message.author;
    const char = await Character.findOne({ userId: user.id });

    if (char) {
      return ErrorEmbed(message.channel, user, "You already have a character!");
    }

    let name = await args.rest('string');
    if (!name) {
      return ErrorEmbed(message.channel, user, "You must enter a name!");
    }

    const charName = await Character.findOne({ name: name });
    if (charName) {
      return ErrorEmbed(message.channel, user, "That name is already taken!");
    }

    if (name.length > 20) {
      return ErrorEmbed(message.channel, user, "Your name must be 20 characters or less!");
    }
    

    return message.channel.send(`${name} has started their adventure!`);
  }
}