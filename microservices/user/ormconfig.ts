import { ENTITIES } from '@entity';

export = [
  /*** per lo sviluppo in localhost con il db persistente ****/
  {
    environment: 'dev',
    name: 'default',
    type: 'postgres',
    url: 'postgresql://postgres:postgres@localhost:54321/user',
    synchronize: 'true',
    logging: true,
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      'migrations/**/*.js',
    ],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
  /****** da qui in poi sono per le build, ricordarsi i node_env ******/
  {
    environment: 'dev',
    name: 'dev',
    type: 'postgres',
    url: 'postgresql://postgres:postgres@user-data:5432/user',
    synchronize: 'true',
    logging: true,
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      'migrations/**/*.js',
    ],
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
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      'migrations/**/*.js',
    ],
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
    entities: ENTITIES,
    migrations: [
      'src/migrations/**/*.ts',
      'migrations/**/*.js',
    ],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
    },
    migrationsTableName: '_migration_table',
  },
];
