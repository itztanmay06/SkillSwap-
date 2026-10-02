const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

// Initial fallback dataset
const initialData = {
  users: [
    {
      id: 'u-1',
      name: 'Tanmay Mittal',
      email: 'tanmay@example.com',
      password: '123',
      title: 'Full Stack MERN Developer & Student',
      location: 'Delhi, India',
      points: 200,
      skillsOffered: ['React.js & Modern Web Dev'],
      skillsWanted: ['UI/UX Design in Figma'],
      rating: 0.0,
      joinedDate: 'Sept 2026'
    }
  ],
  skills: [
    {
      id: 's-2',
      title: 'UI/UX Design in Figma',
      category: 'Design',
      description: 'Master wireframing, color psychology, typography, and interactive prototyping.',
      pointsPerHour: 40,
      rating: 4.9,
      reviewsCount: 15,
      user: { name: 'Vanshika Sharma', location: 'Mumbai, India' }
    },
    {
      id: 's-3',
      title: 'Acoustic Guitar Basics',
      category: 'Music',
      description: 'Beginner friendly chords, strumming patterns, and rhythm training for beginners.',
      pointsPerHour: 35,
      rating: 4.8,
      reviewsCount: 9,
      user: { name: 'Vanshika Jindal', location: 'Bangalore, India' }
    },
    {
      id: 's-4',
      title: 'SEO & Growth Marketing',
      category: 'Marketing',
      description: 'Keyword research, on-page optimization, content strategy, and organic growth tracking.',
      pointsPerHour: 45,
      rating: 4.7,
      reviewsCount: 11,
      user: { name: 'Tanmay', location: 'Pune, India' }
    }
  ],
  requests: []
};

// Create db.json if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Read database
const getFileDB = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return initialData;
  }
};

// Save database
const saveFileDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving to db.json:', err.message);
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`MongoDB not running locally (${err.message}). Recording records to db.json file.`);
    return false;
  }
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  isMongoConnected,
  getFileDB,
  saveFileDB
};
