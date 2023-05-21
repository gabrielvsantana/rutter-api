import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const MigrationsDataSource = new DataSource({
  url: process.env.PG_URI,
  type: 'postgres',
  migrations: ['./src/migrations/*.ts'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
  synchronize: false,
  logging: true,
});

export default MigrationsDataSource;
