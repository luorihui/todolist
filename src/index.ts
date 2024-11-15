// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Database from './config/database';
import { ObjectId } from 'mongodb';
import cors from 'cors';
import { todo } from 'node:test';

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
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const TODOS_COLLECTION = 'todos';
/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

/**
 * Todo list endpoints
 */

/**
 * Get all the todos
 */
app.get('/todos', async (req: Request, res: Response) => {
  try {
    const collection = Database.getDb().collection(TODOS_COLLECTION);
    const todos = await collection.find({}).toArray();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get a single todo
 */
app.get('/todos/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const collection = Database.getDb().collection(TODOS_COLLECTION);
    const todo = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a todo
 */
app.post('/todos', async (req: Request, res: Response) => {
  console.log(`name=${req.body.name}`);
  console.log(`description=${req.body.description}`);
  console.log(`priority=${req.body.priority}`);

  let respPayload : { status: string, todo: any | null } = { status: 'failure', todo: null };
  try {
    const collection = Database.getDb().collection(TODOS_COLLECTION);
    const result = await collection.insertOne({
      name: req.body.name,
      priority: req.body.priority,
      description: req.body.description,
      status: req.body.status,
      createdAt: new Date(),
    });
    console.log('Inserted document:', result);
    const todo = await collection.findOne({
      _id: result?.insertedId,
    });
    respPayload = { status: 'success', todo: todo };
  } catch (error) {
    console.error('Error inserting document:', error);
  }
  res.json(respPayload);
});

/**
 * Update a todo
 */
app.put('/todos/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const collection = Database.getDb().collection(TODOS_COLLECTION);

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          priority: req.body.priority,
          status: req.body.status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete a todo
 */
app.delete('/todos/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const collection = Database.getDb().collection(TODOS_COLLECTION);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', id: id });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Initialize connection when app starts
const initApp = async () => {
  try {
    await Database.connect();
    // Start your express app or other initialization here
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

initApp();
