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
      "src/entity/**/*.ts"
   ],
   migrations: [
      "src/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber"
   },
   migrationsTableName: "_migration_table"
}