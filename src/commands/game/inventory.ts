import { Args, Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { ButtonInteraction, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { BOT_ERROR_RGB_COLOR, BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
import Character from "../../schemas/Character";
import { ErrorEmbed, GetDisplayName, GetItemProperties, IsValidItem } from "../../utils/Utils";

export class InventoryCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["inv", "items"],
      description: "See your current inventory!",
      fullCategory: ["game"],
      cooldownDelay: Time.Second * 5,
      cooldownLimit: 1
    });
  }

  public async messageRun(message: Message, args: Args): Promise<Message> {
    const user = message.author;

    const char: ICharacter = await Character.findOne({ userId: user.id });
    if (!char) {
      return ErrorEmbed(message.channel, user, "you don't have a character!");
    }

    const inventory = char.inventory;
    const option: string = await args.pick('string').catch(() => null);

    let item: string = await args.rest('string').catch(() => null);
    let remove = false;
    
    if (!option) {
      if (!inventory) {  // No items on inventory
        const noItemsMessage = new MessageEmbed()
          .setTitle(`${user.username}'s Inventory`)
          .setDescription("You don't have any items on your inventory, buy some with `k!shop`.")
          .setColor(BOT_ERROR_RGB_COLOR);

        return message.channel.send({ embeds: [noItemsMessage] });
      }

      let msg = "Open crates by using `k!crates`\nIf you want to use some item do `k!inventory use <item_name>`\nSee item's information with `k!inventory info <item_name>`\n\n";
      msg += "**__Items__**\n";
      msg += inventory.map(i => `» **${GetDisplayName(i.id)}** (${i.amount})`).join("\n");

      const invMessage = new MessageEmbed()
        .setTitle(`${user.username}'s Inventory`)
        .setColor(BOT_GLOBAL_RGB_COLOR)
        .setDescription(msg)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }));

      return message.channel.send({ embeds: [invMessage] });
    }

    if (option.toLowerCase() === "use") {
      if (!item) {  // No item specified
        let msg = "you need to specify an item!";
        msg += "\nUse `k!inventory use <item_name>`";
        msg += "\n\n**__Items__**\n";
        msg += (inventory.length > 0) 
          ? inventory.map(i => `» **${GetDisplayName(i.id)}** (${i.amount})`).join("\n") 
          : "You don't have any items on your inventory, buy some with `k!shop`.";

        return ErrorEmbed(message.channel, user, msg);
      }

      item = item.toLowerCase();  // Make sure the item is lowercase

      const itemReg = item.replace(/\s/g, '_'); // Replace spaces with _
      const usedItem = inventory.find(i => i.id === itemReg); // Find the item in the inventory

      if (!IsValidItem(itemReg)) {  // Check if the item is valid
        return ErrorEmbed(message.channel, user, "that item doesn't exists!");
      }

      if (!usedItem) {  // Item not found
        return ErrorEmbed(message.channel, user, "you don't have that item!");
      }

      if (usedItem.amount <= 0) {  // Double check if has the item
        return ErrorEmbed(message.channel, user, "you don't have that item!");
      }

      let itemProperties = GetItemProperties(usedItem.id);

      if (!itemProperties.usable) {
        return ErrorEmbed(message.channel, user, "that item can't be used!");
      }

      // Items that can be used
      
      if (usedItem.id == "welcome_book") {
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("left_btn")
            .setStyle('SECONDARY')
            .setEmoji('⬅️'),
          new MessageButton()
            .setCustomId('right_btn')
            .setStyle('SECONDARY')
            .setEmoji('➡️'),
        );
        
        let pages = [
          `Hello there **${user.username}**, this is a little guide that i made to help you!\nIf you like the bot and want to help the developer give some suggestions using \`k!suggest\`\n\nYou can continue reading pressing the arrow buttons!`,
          "I presume it's your first time, so you need to know a couple of things to start your adventure!\n\nFirst, you can buy some items in `k!shop`, maybe a fishing rod to get some gold..",
          "You can fight with other players over Discord using `k!match` and win trophies and get into the `k!leaderboard`.",
          "If you like magic you can use the `k!spells` command to see all the spells you can use and `k!potions` to see what each potion does.",
          "Are you alone? Join the other players clan using `k!clans` to find one.",
          "This bot is completely free, if you want to support the developer you can use `k!donate` to donate to the developer.\n\nThanks for using the bot!",
        ];

        let page = 1;

        let embed = new MessageEmbed()
          .setTitle(`📙 Welcome Book`)
          .setColor(BOT_GLOBAL_RGB_COLOR)
          .setDescription(pages[0])
          .setFooter({ text: `Page ${page} of ${pages.length}` });

        let msg = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = (btnInt: Interaction) => {
          return user.id === btnInt.user.id;
        };

        const collector = message.channel.createMessageComponentCollector({
          filter,
          time: 60 * 1000,  // 1 minute
        });

        collector.on('collect', (i: ButtonInteraction) => {
          i.deferUpdate()
          if (i.customId === 'left_btn') {
            if (page > 1) {
              page--;
              embed.setDescription(pages[page - 1]);
              embed.setFooter({ text: `Page ${page} of ${pages.length}` });
              msg.edit({ embeds: [embed] });
            }
          } else if (i.customId === 'right_btn') {
            if (page < pages.length) {
              page++;
              embed.setDescription(pages[page - 1]);
              embed.setFooter({ text: `Page ${page} of ${pages.length}` });
              msg.edit({ embeds: [embed] });
            }
          }
        });
      }

      // End of items that can be used
      
      if (remove) { // Remove items from inventory
        if (usedItem.amount === 1) {
          Character.updateOne({ userId: user.id }, {
            $pull: {
              inventory: {
                id: usedItem.id
              }
            }
          }).exec();
        } else {
          Character.updateOne(
            { 
              userId: user.id,
              "inventory.id": usedItem.id
            }, 
            { $set: 
              {
                "inventory.$.amount": usedItem.amount - 1,
              }
            }
          ).exec();
        }
      }
      
      itemProperties.onUse(char);
    }

    if (option.toLowerCase() === "info") {
      if (!item) {  // No item specified
        let msg = "you need to specify an item!";
        msg += "\nUse `k!inventory info <item_name>`";

        return ErrorEmbed(message.channel, user, msg);
      }

      item = item.toLowerCase();  // Make sure the item is lowercase

      const itemReg = item.replace(/\s/g, '_'); // Replace spaces with _

      if (!IsValidItem(itemReg)) {  // Check if the item is valid
        return ErrorEmbed(message.channel, user, "that item doesn't exists!");
      }

      let itemProperties = GetItemProperties(itemReg);
      let itemType = itemProperties.type;

      let msg = `Name: \`${itemProperties.name}\``;
      msg += `\nUsable: \`${itemProperties.usable ? "Yes" : "No"}\``;

      if (itemType === "weapon" || itemType === "shield" || itemType === "potion" || itemType === "spell" || itemType === "misc") {
        msg += `\nDamage: \`${itemProperties.damage || "None"}\``;
      }

      msg += `\nPrice: \`${itemProperties.price || "None"}\``;

      let itemTypeCapitalized = itemType.charAt(0).toUpperCase() + itemType.slice(1);

      msg += `\nType: \`${itemTypeCapitalized}\``;
      msg += `\n\n**__Description__**\n`;
      msg += itemProperties.description || "No description available.";

      let infoEmbed = new MessageEmbed()
        .setTitle(`📘 Item Information`)
        .setColor(BOT_GLOBAL_RGB_COLOR)
        .setDescription(msg);

      if (itemProperties.image) {
        infoEmbed.setThumbnail(itemProperties.image);
      }

      message.channel.send({ embeds: [infoEmbed] });
    }
  }
}