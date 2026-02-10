import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "./env.js";

// 1. Create a Postgres connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// 2. Create Prisma Postgres adapter
const adapter = new PrismaPg(pool);

// 3. Create Prisma Client using the adapter
const prisma = new PrismaClient({
  adapter,
});

export default prisma;
