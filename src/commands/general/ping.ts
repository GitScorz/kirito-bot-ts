import { Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { BOT_GLOBAL_RGB_COLOR, BOT_IDLE_RGB_COLOR } from "../../config/Config";

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      aliases: ["pong", "latency"],
      description: "Pong!",
      fullCategory: ["general"],
      cooldownDelay: Time.Second * 5,
      cooldownLimit: 1
    });
  }

  public async messageRun(message: Message): Promise<Message> {
    const calculatingEmbed = new MessageEmbed()
      .setDescription("Calculating..")
      .setColor(BOT_IDLE_RGB_COLOR)

    const m = await message.channel.send({ embeds: [calculatingEmbed] });

    const latency = Math.round(m.createdTimestamp - message.createdTimestamp);
    const apiLatency = Math.round(this.container.client.ws.ping);

    let msg = `\nLatency » \`${latency}ms\``;
    msg += `\nAPI Latency » \`${apiLatency}ms\``;

    const pongEmbed = new MessageEmbed()
      .setTitle("Pong! 🏓")
      .setDescription(msg)
      .setColor(BOT_GLOBAL_RGB_COLOR)
      .setTimestamp();

    return m.edit({ embeds: [pongEmbed] });
  }
}