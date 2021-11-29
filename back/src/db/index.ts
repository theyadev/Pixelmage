import Mongoose from "mongoose";

import { config } from "dotenv";
import { Answer, Category } from "../types";

config();

let database: Mongoose.Connection;

async function connect() {
  if (database) return;
  if (!process.env.MONGODB_URI) return undefined;

  await Mongoose.connect(process.env.MONGODB_URI);

  database = Mongoose.connection;
}

class Cache {
  date?: Date;
  images: Answer[];
  categories: Category[];

  constructor() {
    this.images = [];
    this.categories = [];
  }

  isRecent() {
    return (
      this.date && this.date >= new Date(new Date().getTime() - 10 * 60000)
    );
  }

  async update() {
    await connect();

    const categoriesDatabase = database.collection("categories");
    const imagesDatabase = database.collection("images");

    const resCategories: any = await categoriesDatabase.find({}).toArray();
    const categories: Category[] = resCategories;

    const resImages: any = await imagesDatabase.find({}).toArray();
    const images: Answer[] = resImages;

    cache.categories = categories;
    cache.images = images;

    cache.date = new Date();
  }
}

const cache = new Cache();

function randomSort() {
  return Math.random() - 0.5;
}

function getRandomItems(list: any[], nb: number) {
  const randomSorted = list.sort(randomSort);

  return randomSorted.splice(0, nb);
}

export async function getCategories() {
  if (!cache.isRecent()) {
    await cache.update();
  }

  return cache.categories;
}

async function getCategoriesIds(categoriesNames: string[]) {
  if (!cache.isRecent()) {
    await cache.update();
  }

  const filteredCategories = cache.categories.filter((e) =>
    categoriesNames.includes(e.category)
  );

  const categoriesIds: number[] = filteredCategories.map((e) => {
    return e.id;
  });

  return categoriesIds;
}

export async function getImages(categoriesFilters: string[], nb: number) {
  if (!cache.isRecent()) {
    await cache.update();
  }

  const categories = await getCategoriesIds(categoriesFilters);

  const images = cache.images.filter((e) => categories.includes(e.categoryId));

  return getRandomItems(images, nb);
}
