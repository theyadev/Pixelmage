import Mongoose from "mongoose";

import { config } from "dotenv";
import { Answer, Category } from "../types";

config();

let database: Mongoose.Connection;

/**
 * Connect to the database.
 */
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
    return this.date
      ? this.date >= new Date(new Date().getTime() - 10 * 60000)
      : false;
  }

  /**
   * Update the cache with new values
   */
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

/**
 * Converts an Array of categories and a number of rounds to a list of numbers.
 * Example: categories.length = 4, numberOfRounds = 7 -> returns [2, 2, 2, 1]
 */
function getNumbersOfEach(numberOfCategories: number, numberOfRounds: number) {
  let numbers = [];

  for (let i = 0; i < numberOfCategories; i++) {
    numbers.push(Math.floor(numberOfRounds / numberOfCategories));
  }

  for (let i = 0; i < numberOfRounds % numberOfCategories; i++) {
    numbers[i] += 1;
  }

  return numbers;
}

/**
 * @returns An evenly random Array of Answer for each categories
 */
function getRandomImages(
  categories: Category[],
  images: Answer[],
  numberOfRounds: number
) {
  const randomImages = images.sort(randomSort);
  const randomCategories = categories.sort(randomSort);

  const numbers = getNumbersOfEach(categories.length, numberOfRounds);

  let answers: Answer[] = [];

  const randomImagesList = randomCategories.map((category) => {
    return randomImages.filter((image) => image.categoryId == category.id);
  });

  for (let i = 0; i < numbers.length; i++) {
    const categoryAnswers = randomImagesList[i].splice(0, numbers[i]);

    for (const answer of categoryAnswers) {
      answers.push(answer);
    }
  }

  return answers.sort(randomSort);
}

/**
 * @returns Every categories
 */
export async function getCategories() {
  if (!cache.isRecent()) {
    await cache.update();
  }

  return cache.categories;
}

/**
 * Get categories from an array of category names
 */
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
