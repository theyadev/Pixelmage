export type Answer = {
  url: string;
  answer: string;
  aliases: string[];
  categoryId: number;
};

export type Category = {
  category: string;
  id: number;
}

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
  roundEnded: boolean;
  categories: string[];
  showCategories: boolean;
  currentRound: number;
  maxRounds: number;
  maxTime: number;
  chat: Message[];
  type: "public" | "private";
  answers: Answer[];
  started: boolean;
  currentTime: number;
};
