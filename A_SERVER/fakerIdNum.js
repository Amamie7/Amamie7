import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from './Models/userModel.js';
import Post from './Models/postModel.js';
import Like from './Models/likeModel.js';
import Comment from './Models/commentModel.js';

mongoose.connect('mongodb://localhost:27017/mysocialmediaAdvanced');

const generateData = async () => {
  try {
    await mongoose.connection.dropDatabase();

    // Generate Users
    const users = [];
    for (let i = 0; i < 20; i++) {
      users.push(new User({
        _id: i + 1, // Use a simple incrementing number for _id
        name: faker.person.fullName(),
        role: 'user',
        dateOfBirth: faker.date.past({ years: 30, refDate: new Date(2000, 0, 1) }),
        email: faker.internet.email(),
        password: 'password123',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
      }));
    }
    // console.log('users', users)
    // const insertedUsers = await User.insertMany(users);
    const insertedUsers = await User.create(users);

    // Generate Posts
    const posts = [];
    for (let i = 0; i < 60; i++) {
      const userId = faker.helpers.arrayElement(insertedUsers)._id;
      posts.push({
        _id: i + 1, // Use an incrementing number for post IDs
        userId: userId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
      });
    }
    const insertedPosts = await Post.insertMany(posts);

    // Generate Likes
    const likes = [];
    for (let i = 0; i < 60; i++) {
      const userId = faker.helpers.arrayElement(insertedUsers)._id;
      const postId = faker.helpers.arrayElement(insertedPosts)._id;
      likes.push({
        _id: i + 1, // Use an incrementing number for like IDs
        userId: userId,
        postId: postId,
        like: faker.datatype.boolean(),
      });
    }
    await Like.insertMany(likes);

    // Generate Comments
    const comments = [];
    for (let i = 0; i < 40; i++) {
      const userId = faker.helpers.arrayElement(insertedUsers)._id;
      const postId = faker.helpers.arrayElement(insertedPosts)._id;
      comments.push({
        _id: i + 1, // Use an incrementing number for comment IDs
        userId: userId,
        postId: postId,
        comment: faker.lorem.sentences(2),
        date: faker.date.recent(),
      });
    }
    await Comment.insertMany(comments);

    console.log('Sample data generated');
  } catch (err) {
    console.error('Error generating sample data:', err);
  } finally {
    mongoose.connection.close();
  }
};

generateData();
