import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as auth from "./schema/auth";
import * as business from "./schema/business";
import * as customer from "./schema/customer";
import * as form from "./schema/form";
import * as formsToCustomers from "./schema/forms-customers";

export const schema = {
  ...auth,
  ...business,
  ...customer,
  ...form,
  ...formsToCustomers,
};

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export const db = drizzle(
  new Client({
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }).connection(),
  { schema },
);
