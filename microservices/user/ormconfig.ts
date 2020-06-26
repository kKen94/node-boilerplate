import * as entities from '@entity';

export = [
  {
    environment: 'dev',
    name: 'dev',
    type: 'postgres',
    url: 'postgresql://postgres:postgres@user-data:5432/user',
    synchronize: 'true',
    logging: true,
    entities: entities,
    migrations: ['src/migrations/**/*.ts'],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
  {
    environment: 'staging',
    name: 'staging',
    type: 'postgres',
    url: 'postgres://kleqlggk:XMMZZWS_9Ec4E1_3n9hNAxAn76MOJqxS@rogue.db.elephantsql.com:5432/kleqlggk',
    synchronize: 'true',
    logging: true,
    entities: entities,
    migrations: ['src/migrations/**/*.ts'],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
  {
    environment: 'prod',
    name: 'prod',
    type: 'postgres',
    url: 'postgres://dadefinire',
    synchronize: 'false',
    logging: true,
    entities: entities,
    migrations: ['src/migrations/**/*.ts'],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
];
