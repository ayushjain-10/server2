/**
 * @fileoverview This is the main server file for the Fake Stack Overflow REST API.
 * It sets up an Express server with middleware for CORS, JSON parsing, and OpenAPI validation.
 * It connects to the MongoDB database and sets up the routes for the API endpoints.
 * 
 * The server follows a layered architecture pattern:
 * - The controller layer handles HTTP requests and responses
 * - The service layer contains the business logic
 * - The model layer interacts with the MongoDB database
 * - The schema layer defines the data structure
 * 
 * The API is organized into three main routes:
 * - Tags route: Managing tags and their statistics
 * - Questions route: Managing questions and their operations
 * - Answers route: Managing answers to questions
 * 
 * @module server
 */

import cors from "cors";
import mongoose from "mongoose";
import { Server } from "http";
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import { middleware } from "express-openapi-validator";
import path from "path";

// Import routes and middleware
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const MONGO_URL: string = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL: string = "http://localhost:3000";
const port: number = 8000;

// Connect to MongoDB
mongoose.connect(MONGO_URL);

const app: Express = express();

// Middleware to allow cross-origin requests from the client URL
app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

// Middleware to parse the request body
app.use(express.json());

// Set up Swagger UI
const openApiPath = path.join(__dirname, 'openapi.yaml');
const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, 'utf8'));

const swaggerOptions = {
  customSiteTitle: "Fake Stack Overflow API Documentation",
  customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 } .swagger-ui .scheme-container { display: none }',
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: 'none',
    showCommonExtensions: true
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, swaggerOptions));

// Middleware to validate the request and response against the Open API specification
app.use(
  middleware({
    apiSpec: openApiPath,
    validateRequests: true,
    validateResponses: true,
    formats: {
      'mongodb-id': /^[0-9a-fA-F]{24}$/
    }
  })
);

// Use the routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const server: Server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

// Gracefully shutdown the server and the database connection when the process is terminated
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed.");
  });
  mongoose
    .disconnect()
    .then(() => {
      console.log("Database instance disconnected.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during disconnection:", err);
      process.exit(1);
    });
});

module.exports = server;
