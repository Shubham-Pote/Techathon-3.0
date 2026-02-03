import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// A basic GET route to check if the server is alive
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend is working fine!',
    timestamp: new Date().toISOString()
  });
});

// A POST route to test data handling
app.post('/echo', (req: Request, res: Response) => {
  const { data } = req.body;
  res.json({ received: data });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}/health`);
});
