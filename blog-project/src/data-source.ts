import { DataSource, DataSourceOptions } from 'typeorm';

export const dbdataSource: DataSourceOptions = {
  type: 'postgres',
  database: 'BlogDb',
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.{js,ts}'],
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sql',
  logging: true
};
const dataSource = new DataSource(dbdataSource);
export default dataSource;
