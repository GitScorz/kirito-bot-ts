import { ColorResolvable, PresenceData } from "discord.js";

export const BOT_PREFIX: string = "k!";

export const BOT_OWNERS: string[] = ["719306478804271155"];
export const BOT_VERSION: string = "v2.0.0";

export const BOT_GLOBAL_RGB_COLOR: ColorResolvable = [59, 112, 223];
export const BOT_IDLE_RGB_COLOR: ColorResolvable = [255, 150, 31];
export const BOT_ERROR_RGB_COLOR: ColorResolvable = [255, 0, 0];
export const BOT_SUCCESS_RGB_COLOR: ColorResolvable = [0, 255, 0];
export const BOT_INVISIBLE_RGB_COLOR: ColorResolvable = [54, 57, 64];

// export const BOT_INVITE_URL: string = "some url";
// export const BOT_WEBSITE_URL: string = "some website";

export const BOT_PRESENCE: PresenceData = {
  status: 'online',
  activities: [
    {
      type: "WATCHING",
      name: BOT_VERSION,
    }
  ]
};

// CLANS

export const CLAN_GEM_COST: number = 45;
export const CLAN_MEMBER_LIMIT: number = 10;