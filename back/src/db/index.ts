import { Client } from "pg";

import { config } from "dotenv";

config();

const client = new Client();

client.connect();

export function query(queryText: string) {
  return client.query(queryText);
}
