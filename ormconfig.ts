export = [
  {
    environment: 'dev',
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    synchronize: false,
    logging: true,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    seeds: ['src/seeds/**/*.seed.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscriber',
    },
    migrationsTableName: '_migration_table',
  },
  {
    environment: 'staging',
    name: 'staging',
    type: 'postgres',
    host: '31.3.175.131',
    port: 5432,
    username: 'postgres',
    password: 'Eagle_123',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    seeds: ['src/seeds/**/*.seed.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscriber',
    },
    migrationsTableName: '_migration_table',
  },
  {
    environment: 'prod',
    name: 'prod',
    type: 'postgres',
    host: '',
    port: 0,
    username: '',
    password: '',
    database: '',
    synchronize: true,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    seeds: ['src/seeds/**/*.seed.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscriber',
    },
    migrationsTableName: '_migration_table',
  },
];
