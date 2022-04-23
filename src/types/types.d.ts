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
  createdAt: number;
}

interface IItems {
  [id: string]: {
    name: string;
    description: string;
    type: "weapon" | "shield" | "book" | "misc";
    inShop: boolean;
    usable: boolean;
    price?: number;
    damage?: number;
    durability?: number;
    // effect?: (character: ICharacter) => void;
    onUse: (character: ICharacter) => void;
  };
}

interface IItem {
  name: string;
  description: string;
  type: "weapon" | "shield" | "book" | "misc";
  price: number;
  damage: number;
  durability: number;
  usable: boolean;
  onUse: (character: ICharacter) => void;
}