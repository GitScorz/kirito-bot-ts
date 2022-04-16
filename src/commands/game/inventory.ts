import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_ERROR_RGB_COLOR, BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
import Character from "../../schemas/Character";
import { ErrorEmbed, GetDisplayName } from "../../utils/Utils";

export class InventoryCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["inv", "items"],
      description: "See your current inventory!",
      fullCategory: ["game"],
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    const user = message.author;

    const char: ICharacter = await Character.findOne({ userId: user.id });
    if (!char) {
      return ErrorEmbed(message.channel, user, "you don't have a character!");
    }
    
    const inventory = char.inventory;

    if (!inventory) {
      const noItemsMessage = new MessageEmbed()
        .setAuthor({
          name: `${user.username}'s Inventory`,
          iconURL: user.displayAvatarURL({ dynamic: true })
        })
        .setDescription("You don't have any items on your inventory, buy some with `k!shop`.")
        .setColor(BOT_ERROR_RGB_COLOR);

      return message.channel.send({ embeds: [noItemsMessage] });
    }

    let msg = "Open crates by using `k!crates`\nIf you want to use some item do `k!inventory use <item_name>`\n\n";
    msg += "**__Items__**\n";
    msg += inventory.map(i => `» **${GetDisplayName(i.id)}** (${i.amount})`).join("\n");

    const invMessage = new MessageEmbed()
      .setTitle(`${user.username}'s Inventory`)
      .setColor(BOT_GLOBAL_RGB_COLOR)
      .setDescription(msg)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }));

    return message.channel.send({ embeds: [invMessage] });
  }
}