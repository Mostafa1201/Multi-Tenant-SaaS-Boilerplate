import 'reflect-metadata';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import masterDatasource from '../datasource/master.datasource';
import { Tenant } from '../../modules/core/tenant/entities/tenant.entity';

dotenv.config();

async function main() {
  try {
    await masterDatasource.initialize();
    const tenants = await masterDatasource.getRepository(Tenant).find({
      relations: ['dbCredentials']
    });
    for (const tenant of tenants) {
      execSync(
        `npx typeorm-ts-node-commonjs migration:run \
                -d ./src/db/datasource/tenant.datasource.ts \
                -- --tenantCode ${tenant.tenantCode} \
                --host ${tenant.dbCredentials.host} \
                --port ${tenant.dbCredentials.port} \
                --database ${tenant.dbCredentials.database} \
                --username ${tenant.dbCredentials.username} \
                --password ${tenant.dbCredentials.password}`,
        { stdio: 'inherit' }
      );
    }
    process.exit(0);
  } catch (err) {
    console.error('Error running tenant migrations:', err);
    if (err.stderr) console.error(err.stderr.toString());
    if (err.stdout) console.error(err.stdout.toString());
    process.exit(1);
  }
}

main();
