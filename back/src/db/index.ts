import Mongoose from "mongoose";

import { config } from "dotenv";
import { Answer, Category } from "../types";

config();

type Cache = {
  date?: Date;
  images?: Answer[];
  categories?: Category[];
}

let cache: Cache = {};

let database: Mongoose.Connection;

async function connect() {
  if (database) return;
  if (!process.env.MONGODB_URI) return undefined;

  await Mongoose.connect(process.env.MONGODB_URI);

  database = Mongoose.connection;
}

function randomSort(a: any, b: any) {
  return Math.random() - 0.5;
}

function getRandomItems(list: any[], nb: number) {
  const randomSorted = list.sort(randomSort);

  return randomSorted.splice(0, nb);
}

function isCacheRecent() {
  return cache.date && cache.date >= new Date(new Date().getTime() - 10*60000)
}

export async function getCategories() {
  if (cache.categories && isCacheRecent()) {
    return cache.categories
  }

  await connect();

  const categoriesDatabase = database.collection("categories");

  const res : any =  await categoriesDatabase.find({}).toArray()
  const categories : Category[] = res

  cache.categories = categories
  cache.date = new Date()

  return categories
}

async function getCategoriesIds(categoriesNames: string[]) {
  let categories: Category[];

  if (cache.categories && isCacheRecent()) {
    categories = cache.categories
  } else {
    await connect();

    const categoriesDatabase = database.collection("categories");

    const res: any = await categoriesDatabase.find({}).toArray();

    categories = res
  }

  const filteredCategories = categories.filter(e => categoriesNames.includes(e.category))

  const categoriesIds: number[] = filteredCategories.map((e) => {
    return e.id;
  });

  return categoriesIds;
}

export async function getImages(categoriesFilters: string[], nb: number) {
  let images: Answer[];

  if (cache.images && isCacheRecent()) {
    images = cache.images
  } else {
    await connect();

    const imagesDatabase = database.collection("images");
    const res: any = await imagesDatabase.find({}).toArray();
    images = res
  }

  const categories = await getCategoriesIds(categoriesFilters);

  images = images.filter(e => categories.includes(e.categoryId))

  return getRandomItems(images, nb);
}
