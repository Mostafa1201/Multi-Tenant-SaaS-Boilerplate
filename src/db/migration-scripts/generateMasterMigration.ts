import 'reflect-metadata';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { parseArguments } from '../utils/db-utils';

dotenv.config();
const args = parseArguments(process.argv);
const migrationName = String(args['migration-name']);

async function main() {
  try {
    execSync(
      `npx typeorm-ts-node-commonjs migration:generate \
            ./src/db/master-migrations/${migrationName} \
            -d ./src/db/datasource/master.datasource.ts`,
      { stdio: 'inherit' }
    );
    process.exit(0);
  } catch (err) {
    console.error('Error generating master migration:', err);
    if (err.stderr) console.error(err.stderr.toString());
    if (err.stdout) console.error(err.stdout.toString());
    process.exit(1);
  }
}

main();
