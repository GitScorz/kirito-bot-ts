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
      items: {
          id: string;
          amount: number;
      }[];
  };
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
  createdAt: Date;
}