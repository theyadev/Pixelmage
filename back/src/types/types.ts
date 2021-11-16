export type Answer = {
  image: string;
  name: string;
  aliases: string[];
};

export type Message = {
  author: string;
  content: string;
  date: Date;
};

export type User = {
  username: string;
  score: number;
  host: boolean;
  answered: boolean;
  color: string;
};

export type Room = {
  id: number;
  users: User[];
  category: "Anime";
  currentRound: number;
  maxRounds: number;
  maxTime: number;
  chat: Message[];
  // pixelisationStatus: number,
  answers: Answer[];
  started: boolean;
  // alreadyUsedImages: Answer[],
};
