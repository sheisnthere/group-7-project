import mongoose from 'mongoose';

/**
 * Connect to MongoDB (MongoDB Atlas or local).
 *
 * The connection string comes from the MONGO_URI environment variable, e.g.
 *   Atlas:  mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/marketplace?retryWrites=true&w=majority
 *   Local:  mongodb://127.0.0.1:27017/marketplace
 */
const connectDB = async (): Promise<typeof mongoose> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      'MONGO_URI belum diset. Salin .env.example menjadi .env lalu isi connection string MongoDB Atlas kamu.',
    );
  }

  // Fail fast instead of hanging if the cluster/credentials are wrong.
  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    // Name of the database to use when it is not already part of the URI path.
    dbName: process.env.MONGO_DB_NAME || undefined,
  });

  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err instanceof Error ? err.message : String(err));
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });

  return conn;
};

export default connectDB;
