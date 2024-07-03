import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  host: "localhost",
  port: 3001,
  user: "postgres",
  password: "postgres",
  database: "social",
});

(async () =>
  await client
    .connect()
    .then(() => {
      console.log("DB CONNECTED SUCCESSFULLY 😊");
    })
    .catch((error) => {
      console.log("DB CONNECTION ERROR 😢", error);
    }))();

const db = drizzle(client);

export default db;
