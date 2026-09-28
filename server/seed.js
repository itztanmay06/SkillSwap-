const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Skill = require('./models/Skill');
const Request = require('./models/Request');
const Transaction = require('./models/Transaction');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

const sampleSkills = [
  {
    title: 'React.js & Modern Web Dev',
    category: 'Programming',
    description: 'Learn modern React hooks, component architecture, state management, and Vite build setups.',
    pointsPerHour: 50,
    user: {
      name: 'Tanmay Mittal',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      location: 'Delhi, India'
    }
  },
  {
    title: 'UI/UX Design in Figma',
    category: 'Design',
    description: 'Master wireframing, color psychology, typography, and interactive prototyping.',
    pointsPerHour: 40,
    user: {
      name: 'Vanshika Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      location: 'Mumbai, India'
    }
  },
  {
    title: 'Acoustic Guitar Basics',
    category: 'Music',
    description: 'Beginner friendly chords, strumming patterns, and rhythm training for beginners.',
    pointsPerHour: 35,
    user: {
      name: 'Vanshika Jindal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      location: 'Bangalore, India'
    }
  },
  {
    title: 'SEO & Growth Marketing',
    category: 'Marketing',
    description: 'Keyword research, on-page optimization, content strategy, and organic growth tracking.',
    pointsPerHour: 45,
    user: {
      name: 'Ayush Kumar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 4.7,
      location: 'Pune, India'
    }
  },
  {
    title: 'Conversational Spanish',
    category: 'Languages',
    description: 'Pronunciation, daily vocabulary, grammar essentials, and real conversational practice.',
    pointsPerHour: 30,
    user: {
      name: 'Sofia Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      location: 'Madrid, Spain'
    }
  },
  {
    title: 'Python & 24/7 Doubt Solving',
    category: 'Programming',
    description: 'Round-the-clock 24/7 live assistance for Python programming, debugging errors, and logic building.',
    pointsPerHour: 35,
    availability: '24/7 Available',
    user: {
      name: 'Ananya Sharma',
      avatar: '',
      rating: 5.0,
      location: 'Chandigarh, India'
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully!');

    // Clear old data
    await Skill.deleteMany({});
    console.log('Cleared existing skills.');

    // Insert sample skills
    await Skill.insertMany(sampleSkills);
    console.log(`Inserted ${sampleSkills.length} sample skills.`);

    // Check or create default user Tanmay
    const existingUser = await User.findOne({ email: 'tanmay@example.com' });
    if (!existingUser) {
      await User.create({
        name: 'Tanmay Mittal',
        email: 'tanmay@example.com',
        password: 'password123',
        title: 'Full Stack MERN Developer & Student',
        points: 200,
        rating: 5.0,
        reviewCount: 5,
        skillsOffered: ['React.js & Modern Web Dev'],
        skillsWanted: ['UI/UX Design in Figma']
      });
      console.log('Created default user: tanmay@example.com');
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
}

seedDatabase();
