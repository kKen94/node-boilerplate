import { ENTITIES } from '@entity';
import { ConnectionOptions } from 'typeorm';

export const CONNECTIONS: ConnectionOptions[] = [
  /*** per lo sviluppo in localhost con il db persistente ****/
  {
    name: 'default',
    type: 'postgres',
    url: 'postgresql://postgres:postgres@localhost:54321/user',
    synchronize: true,
    logging: true,
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      `${__dirname}/migrations/**/*.js`,
    ],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
  /****** da qui in poi sono per le build, ricordarsi i node_env ******/
  {
    name: 'dev',
    type: 'postgres',
    url: 'postgresql://postgres:postgres@user-data:5432/user',
    synchronize: true,
    logging: true,
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      `${__dirname}/migrations/**/*.js`,
    ],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
  {
    name: 'staging',
    type: 'postgres',
    url: 'postgres://kleqlggk:XMMZZWS_9Ec4E1_3n9hNAxAn76MOJqxS@rogue.db.elephantsql.com:5432/kleqlggk',
    synchronize: true,
    logging: true,
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      `${__dirname}/migrations/**/*.js`,
    ],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
  {
    name: 'prod',
    type: 'postgres',
    url: 'postgres://dadefinire',
    synchronize: false,
    logging: true,
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      `${__dirname}/migrations/**/*.js`,
    ],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
];
