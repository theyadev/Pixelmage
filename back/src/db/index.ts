import Mongoose from "mongoose";

import { config } from "dotenv";

config();

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

export async function getCategories() {
  await connect();

  const categoriesDatabase = database.collection("categories");

  return await categoriesDatabase.find({}).toArray()
}

async function getCategoriesIds(categoriesNames: string[]) {
  const categoriesDatabase = database.collection("categories");

  const categories = await categoriesDatabase
    .find({
      category: {
        $in: categoriesNames,
      },
    })
    .toArray();

  const categoriesIds: number[] = categories.map((e) => {
    return e.id;
  });

  return categoriesIds;
}

export async function getImages(categoriesFilters: string[], nb: number) {
  await connect();

  const imagesDatabase = database.collection("images");

  const categories = await getCategoriesIds(categoriesFilters);

  const images = await imagesDatabase
    .find({
      categoryId: {
        $in: categories,
      },
    })
    .toArray();

  return getRandomItems(images, nb);
}
