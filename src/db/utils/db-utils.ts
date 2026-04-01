import { createConnection } from 'mysql2/promise';

export async function createDatabaseIfNotExists(dbName: string) {
  const connection = await createConnection({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await connection.end();
}

export const parseArguments = (args: string[]): Record<string, string | boolean> => {
  const result: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      result[key] = value;
      if (value !== true) i++;
    }
  }
  return result;
};
