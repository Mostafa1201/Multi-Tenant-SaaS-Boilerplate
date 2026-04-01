import 'reflect-metadata';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { parseArguments } from '../utils/db-utils';
import masterDatasource from '../datasource/master.datasource';

dotenv.config();
const args = parseArguments(process.argv);

async function main() {
  try {
    const dataSourcePath = args['datasource'] || './src/db/datasource/master.datasource.ts';
    await masterDatasource.initialize();
    execSync(
      `npx typeorm-ts-node-commonjs migration:run \
            -d ${dataSourcePath}`,
      { stdio: 'inherit' }
    );
    process.exit(0);
  } catch (err) {
    console.error('Error running master migrations:', err);
    if (err.stderr) console.error(err.stderr.toString());
    if (err.stdout) console.error(err.stdout.toString());
    process.exit(1);
  }
}

main();
