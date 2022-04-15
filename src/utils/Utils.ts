import { TextChannel, User, MessageEmbed, DMChannel, PartialDMChannel, NewsChannel, ThreadChannel } from "discord.js";

export function ParseMS(ms: number) { // Parse milliseconds to a human readable string
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const s = seconds % 60;
  const m = minutes % 60;
  const h = hours % 24;

  return `${h}h:${m}m:${s}s`;
}

export function ErrorEmbed(channel: TextChannel | DMChannel | PartialDMChannel | NewsChannel | ThreadChannel, user: User, message: string) {  // Create an error embed
  const err = new MessageEmbed()
    .setDescription(`**${user.username}**, ${message}`)
    .setColor([255, 0, 0]);

  return channel.send({ embeds: [err] });
}
