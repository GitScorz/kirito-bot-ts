interface ICharacter {
  _id: string;
  userId: string;
  name: string;
  health: number;
  shield: number;
  gems: number;
  level: number;
  exp: number;
  gold: number;
  wins: number,
  losses: number,
  daily: {
    lastClaimed: number;
    claimed: boolean;
  };
  inventory: {
    id: string;
    amount: number;
  }[];
  skills: {
      id: string;
      level: number;
  }[];
  equipment: {
    head: string;
    chest: string;
    legs: string;
    feet: string;
    weapon: string;
  };
  quests: {
      id: string;
      progress: number;
  }[];
  achievements: {
      id: string;
      progress: number;
  }[];
  clanId: string;
  createdAt: number;
}

interface IItems {
  [id: string]: {
    name: string;
    description: string;
    type: "weapon" | "shield" | "book" | "potion" | "spell" | "util" | "misc";
    inShop: boolean;
    usable: boolean;
    price?: number;
    damage?: number;
    durability?: number;
    image?: string;
    // effect?: (character: ICharacter) => void;
    onUse: (character: ICharacter) => void;
  };
}

interface IItem {
  name: string;
  description: string;
  type: "weapon" | "shield" | "book" | "potion" | "spell" | "util" | "misc";
  price: number;
  damage: number;
  durability: number;
  usable: boolean;
  image: string;
  onUse: (character: ICharacter) => void;
}

interface IClan {
  _id: string;
  name: string;
  description: string;
  members: string[];
  minimumTrophies: number;
  open: boolean;
  level: number;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}

interface IMatch {
  _id: string;
  startedSearching: number;
  userId: string;
  name: string;
  inMatch: boolean;
  msgId: string;
  channelId: string;
}

interface IOponent {
  id: string;
  msgId: string;
  channelId: string;
  name: string;
}

interface IQuest {
  _id: string;
  name: string;
  description: string;
  progress: number;
  required: number;
  reward: number;
  type: "kill" | "collect" | "craft" | "quest";
  // createdAt: number;
  // updatedAt: number;
}