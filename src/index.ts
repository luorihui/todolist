// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

/**
 * Todo list endpoints
 */

/**
 * Get all the todos
 */
app.get("/todos", (req: Request, res: Response) => {
  res.send({id: 1, shortName: "shopping", description: "A crazy shopping spree"});
});

/**
 * Get a single todo
 */
app.get("/todos/:id", (req: Request, res: Response) => {
  const id =  req.params.id;
  console.log(`Fetch id: ${id}`);
  res.send({id: id, shortName: "shopping", description: "A crazy shopping spree"});
});

/**
 * Create a todo
 */
app.post("/todos", (req: Request, res: Response) => {
  console.log(`shortName=${req.body.shortName}`);
  console.log(`description=${req.body.description}`);
  res.send("Todo created.");
});

/**
 * Update a todo
 */
app.put("/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`Update id=${id}`);
  // First fetch the existing record
  // Merge two 
  // Save the merged one

  res.send(`Todo ${id} is updated.`);
});

/**
 * Delete a todo
 */
app.delete("/todos/:id", (req: Request, res: Response) => {
  console.log(`delete id=${req.params.id}`);
  res.send("Todo deleted.");
});

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
