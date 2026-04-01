import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTenantDatabaseTables1775006309220 implements MigrationInterface {
    name = 'InitTenantDatabaseTables1775006309220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` text NOT NULL, \`value\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`settings\``);
    }

}
