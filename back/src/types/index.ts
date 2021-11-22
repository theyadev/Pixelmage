export type Answer = {
  url: string;
  answer: string;
  aliases: string[];
  category: string;
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
  categories: string[];
  currentRound: number;
  maxRounds: number;
  maxTime: number;
  chat: Message[];
  answers: Answer[];
  started: boolean;
  currentTime: number;
};
