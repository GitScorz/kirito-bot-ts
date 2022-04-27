import { TextChannel, User, MessageEmbed, DMChannel, PartialDMChannel, NewsChannel, ThreadChannel } from "discord.js";
import { BOT_ERROR_RGB_COLOR } from "../config/Config";
import Items from "./Items";

export function ParseMS(ms: number): string { // Parse milliseconds to a human readable string
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
    .setTitle("Error")
    .setDescription(`**${user.username}**, ${message}`)
    .setColor(BOT_ERROR_RGB_COLOR);

  return channel.send({ embeds: [err] });
}

export function GetDisplayName(itemId: string): string { // Get the display name of an item
  let name;

  Object.keys(Items).forEach(function(key) {
    if (key == itemId) {
      name = Items[key].name;
    }
  });

  return name;
}

export function GetItemProperties(itemId: string): IItem {  // Get the properties of an item
  let properties;

  Object.keys(Items).forEach(function(key) {
    if (key == itemId) {
      properties = Items[key];
    }
  });

  return properties;
}

export function IsValidItem(itemId: string): boolean { // Check if an item is valid
  let isValid = false;

  Object.keys(Items).forEach(function(key) {
    if (key === itemId) {
      isValid = true
    }
  });

  return isValid;
}

export const BLACKLISTED_WORDS = [ // List of blacklisted words
  "fuck",
  "fuckers",
  "shit",
  "ass",
  "asses",
  "dicks",
  "cocks",
  "pussy",
  "pussys",
  "nigger",
  "niggers",
  "nigga",
  "niggas",
  "bitch",
  "bitches",
  "nazi",
  "nazis",
]; 

export function NeedExpFormula(level: number): number {
  return ((5 * (Math.pow(level, 2))) + (50 * level)) + 10 + (Math.pow(level, 2) * 2);
}