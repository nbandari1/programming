import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

// CORS config
const corsOptions = {
  origin: 'http://localhost:8081',
  credentials: true,
};

// Handle preflight request
app.options('/graphql', cors(corsOptions));

// Apply CORS for actual requests
app.use('/graphql', cors(corsOptions));

// Log incoming proxy requests
app.use('/graphql', (req: Request, res: Response, next: NextFunction) => {
  console.log(`[PROXY] Incoming request: ${req.method} ${req.url}`);
  next();
});

// Apply proxy to /graphql
app.use(
  '/graphql',
  createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: () => '/graphql',
  })
);

// Simple test route
app.get('/test', (req: Request, res: Response) => {
  res.send('Proxy is working!');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}/graphql`);
});
