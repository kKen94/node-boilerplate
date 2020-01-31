export =
  {
    environment: process.env.NODE_ENV,
    name: process.env.NODE_ENV,
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: 'true' === process.env.DB_SYNC,
    logging: true,
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migrations',
      subscribersDir: 'src/subscriber',
    },
    migrationsTableName: '_migration_table',
  };
