import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR } from "../../config/Config";
import Character from "../../schemas/Character";
import Clan from "../../schemas/Clan";
import { ParseMS } from "../../utils/Utils";

export class BotStatsCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["bs"],
      description: "See the current bot stats!",
      fullCategory: ["general"]
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    let users = 0;

    this.container.client.guilds.cache.forEach((guild) => {
      users += guild.memberCount;
    });

    const characters = (await Character.find({})).length;
    const clans = (await Clan.find({})).length;

    const embed = new MessageEmbed()
      .setAuthor({
        name: "Application Stats",
      })
      .setColor(BOT_GLOBAL_RGB_COLOR)
      .addField("🕝 Uptime", `\`${ParseMS(this.container.client.uptime)}\``, true)
      .addField("😊 Users", `\`${users}\``, true)
      .addField("🖥️ Guilds", `\`${this.container.client.guilds.cache.size}\``, true)
      .addField("📰 Channels", `\`${this.container.client.channels.cache.size}\``, true)
      .addField("👦 Characters", `\`${characters}\``, true)
      .addField("⚔️ Clans", `\`${clans}\``, true)
      .setThumbnail(this.container.client.user.displayAvatarURL({ format: "png", dynamic: true }));

    return message.channel.send({ embeds: [embed] });
  }
}