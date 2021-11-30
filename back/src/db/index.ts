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

    const categories = (await categoriesDatabase
      .find({})
      .toArray()) as Category[];

    const images = (await imagesDatabase.find({}).toArray()) as Answer[];

    cache.categories = categories;
    cache.images = images;

    cache.date = new Date();
  }
}

const cache = new Cache();

function randomSort() {
  return Math.random() - 0.5;
}

function getNumbersOfEach(categories: Category[], nb: number) {
  let numbers = categories.map((e) => {
    return Math.floor(nb / categories.length);
  });

  for (let i = 0; i < nb % categories.length; i++) {
    numbers[i] += 1;
  }

  return numbers
}

function getRandomImages(categories: Category[], images: Answer[], nb: number) {
  const randomImages = images.sort(randomSort);
  const randomCategories = categories.sort(randomSort)

  const numbers = getNumbersOfEach(randomCategories, nb)

  let resImages: Answer[] = [];

  const randomImagesList = randomCategories.map((category) => {
    return randomImages.filter((image) => image.categoryId == category.id);
  });

  for (let i = 0; i < numbers.length; i++) {
    resImages = resImages.concat(randomImagesList[i].splice(0, numbers[i]));
  }

  return resImages;
}

export async function getCategories() {
  if (!cache.isRecent()) {
    await cache.update();
  }

  return cache.categories;
}

async function getFilterCategories(categoriesNames: string[]) {
  if (!cache.isRecent()) {
    await cache.update();
  }

  const filteredCategories = cache.categories.filter((e) =>
    categoriesNames.includes(e.category)
  );

  return filteredCategories;
}

export async function getImages(categoriesFilters: string[], nb: number) {
  if (!cache.isRecent()) {
    await cache.update();
  }

  const categories = await getFilterCategories(categoriesFilters);

  return getRandomImages(categories, cache.images, nb);
}
