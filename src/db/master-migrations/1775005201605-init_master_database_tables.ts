import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMasterDatabaseTables1775005201605 implements MigrationInterface {
    name = 'InitMasterDatabaseTables1775005201605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tenant_db_credentials\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tenantId\` int NOT NULL, \`host\` varchar(255) NOT NULL, \`port\` varchar(255) NOT NULL, \`database\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_70f4c55374abb69daa3656dfbb\` (\`tenantId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tenant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tenantName\` varchar(255) NOT NULL, \`tenantCode\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tenant_db_credentials\` ADD CONSTRAINT \`FK_70f4c55374abb69daa3656dfbb3\` FOREIGN KEY (\`tenantId\`) REFERENCES \`tenant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tenant_db_credentials\` DROP FOREIGN KEY \`FK_70f4c55374abb69daa3656dfbb3\``);
        await queryRunner.query(`DROP TABLE \`tenant\``);
        await queryRunner.query(`DROP INDEX \`REL_70f4c55374abb69daa3656dfbb\` ON \`tenant_db_credentials\``);
        await queryRunner.query(`DROP TABLE \`tenant_db_credentials\``);
    }

}
