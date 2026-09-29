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
      rating: 5.0,
      joinedDate: 'Sept 2026'
    }
  ],
  skills: [
    {
      id: 's-1',
      title: 'React.js & Modern Web Dev',
      category: 'Programming',
      description: 'Learn modern React hooks, component architecture, state management, and Vite build setups.',
      pointsPerHour: 50,
      rating: 5.0,
      reviewsCount: 12,
      user: { name: 'Tanmay Mittal', title: 'Full Stack MERN Developer', location: 'Delhi, India' }
    },
    {
      id: 's-2',
      title: 'UI/UX Design in Figma',
      category: 'Design',
      description: 'Master wireframing, color psychology, typography, and interactive prototyping.',
      pointsPerHour: 40,
      rating: 4.9,
      reviewsCount: 15,
      user: { name: 'Vanshika Sharma', title: 'UI/UX Designer', location: 'Mumbai, India' }
    },
    {
      id: 's-3',
      title: 'Acoustic Guitar Basics',
      category: 'Music',
      description: 'Beginner friendly chords, strumming patterns, and rhythm training for beginners.',
      pointsPerHour: 35,
      rating: 4.8,
      reviewsCount: 9,
      user: { name: 'Rahul Verma', title: 'Musician & Guitarist', location: 'Bangalore, India' }
    },
    {
      id: 's-4',
      title: 'SEO & Growth Marketing',
      category: 'Marketing',
      description: 'Keyword research, on-page optimization, content strategy, and organic growth tracking.',
      pointsPerHour: 45,
      rating: 4.7,
      reviewsCount: 11,
      user: { name: 'Ayush Kumar', title: 'Marketing Specialist', location: 'Pune, India' }
    },
    {
      id: 's-5',
      title: 'Conversational Spanish',
      category: 'Languages',
      description: 'Pronunciation, daily vocabulary, grammar essentials, and real conversational practice.',
      pointsPerHour: 30,
      rating: 4.9,
      reviewsCount: 16,
      user: { name: 'Sofia Rodriguez', title: 'Language Instructor', location: 'Madrid, Spain' }
    },
    {
      id: 's-6',
      title: 'Python & 24/7 Doubt Solving',
      category: 'Programming',
      description: 'Round-the-clock 24/7 live assistance for Python programming, debugging errors, and logic building.',
      pointsPerHour: 35,
      availability: '24/7 Available',
      rating: 5.0,
      reviewsCount: 24,
      user: { name: 'Ananya Sharma', title: 'CS Student • 24/7 Doubt Solver', location: 'Chandigarh, India' }
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
