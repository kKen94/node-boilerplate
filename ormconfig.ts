export = {
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "postgres",
   password: "postgres",
   database: "postgres",
   synchronize: false,
   logging: true,
   entities: [
      "src/entities/**/*.ts"
   ],
   migrations: [
      "src/migrations/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      entitiesDir: "src/entities",
      migrationsDir: "src/migrations",
      subscribersDir: "src/subscriber"
   },
   migrationsTableName: "_migration_table"
}