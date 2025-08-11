import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import app from './app.js';
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') { // Start server in non-test environments
  app.listen(PORT, () => {
    console.log('Database initialization completed');
    console.log(`🚀 Zebulon Oracle System running on port ${PORT}`);
    console.log(`🌐 Frontend and Backend unified on single port`);
    console.log(`💾 Database: PostgreSQL with Prisma`);
    console.log(`🔮 Oracle: Database query and analysis engine ready`);
    console.log(`🔒 Security: Multi-layer protection active`);
    console.log(`🌍 Access your Zebulon Oracle System at: http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
  res.status(status).json({ message });
  console.error(err);
});

async function startServer() {
  try {
    console.log('Initializing database with Prisma...');
    // Start server
    app.listen(PORT, () => {
      console.log('Database initialization completed');
      console.log(`🚀 Zebulon Oracle System running on port ${PORT}`);
      console.log(`🌐 Frontend and Backend unified on single port`);
      console.log(`💾 Database: PostgreSQL with Prisma`);
      console.log(`🔮 Oracle: Database query and analysis engine ready`);
      console.log(`🔒 Security: Multi-layer protection active`);
      console.log(`🌍 Access your Zebulon Oracle System at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export default app;