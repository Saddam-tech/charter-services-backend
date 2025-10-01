/**
 * Database Setup Script
 * This script creates the database and all required tables for the application
 */

const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const config = require("./dbconfig.json");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

async function setupDatabase() {
  let connection;

  try {
    console.log("Starting database setup...");
    console.log(`Environment: ${env}`);
    console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`Database: ${dbConfig.database}`);

    // Step 1: Connect to MariaDB without specifying a database
    console.log("\n[1/3] Connecting to MariaDB server...");
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    console.log("✓ Connected to MariaDB server");

    // Step 2: Create database if it doesn't exist
    console.log(
      `\n[2/3] Creating database '${dbConfig.database}' if not exists...`
    );
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ Database '${dbConfig.database}' is ready`);

    // Close the initial connection
    await connection.end();

    // Step 3: Create all tables using Sequelize
    console.log("\n[3/3] Creating tables from model definitions...");

    const sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.user,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        timezone: "+09:00",
        logging: false, // Set to console.log to see SQL queries
      }
    );

    // Test the connection
    await sequelize.authenticate();
    console.log("✓ Connected to database");

    // Load all models
    const db = {};
    const fs = require("fs");
    const path = require("path");
    const modelsPath = path.join(__dirname, "models");

    fs.readdirSync(modelsPath)
      .filter((file) => {
        return (
          file.indexOf(".") !== 0 &&
          file !== "index.js" &&
          file.slice(-3) === ".js"
        );
      })
      .forEach((file) => {
        const model = require(path.join(modelsPath, file))(
          sequelize,
          Sequelize.DataTypes
        );
        db[model.name] = model;
        console.log(`  → Loaded model: ${model.name}`);
      });

    // Set up associations
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    // Sync all models (create tables)
    console.log("\n  Synchronizing models with database...");
    await sequelize.sync({ force: false }); // Use { force: true } to drop and recreate tables
    console.log("✓ All tables created successfully");

    // Close the connection
    await sequelize.close();

    console.log("\n✅ Database setup completed successfully!");
    console.log("\nYou can now start your application.");
  } catch (error) {
    console.error("\n❌ Error during database setup:");
    console.error(error.message);
    if (error.original) {
      console.error("Original error:", error.original.message);
    }
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
