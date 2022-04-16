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

interface IItem {
  [id: string]: {
    name: string;
    description: string;
    type: "weapon" | "shield" | "book" | "misc";
    price: number;
    damage?: number;
    durability?: number;
    usable?: boolean;
  };
}