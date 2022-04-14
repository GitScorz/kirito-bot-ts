import { Command } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR } from "../../config/config";
import { parseMS } from "../../utils/utils";

export class PingCommand extends Command {
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

    let embed = new MessageEmbed()
      .setAuthor({
        name: "Application Stats",
      })
      .setColor(BOT_GLOBAL_RGB_COLOR)
      .addField("🕝 Uptime", `\`${parseMS(this.container.client.uptime)}\``, true)
      .addField("😊 Users", `\`${users}\``, true)
      .addField("🖥️ Guilds", `\`${this.container.client.guilds.cache.size}\``, true)
      .addField("📰 Channels", `\`${this.container.client.channels.cache.size}\``, true)
      .addField("👦 Characters", `\`${0}\``, true)
      .addField("⚔️ Alliances", `\`${0}\``, true)
      .setThumbnail(this.container.client.user.displayAvatarURL({ format: "png", dynamic: true }));

    return message.channel.send({ embeds: [embed] });
  }
}