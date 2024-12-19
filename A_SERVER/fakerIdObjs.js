// 
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from './Models/userModel.js';
import Post from './Models/postModel.js';
import Like from './Models/likeModel.js';
import Comment from './Models/commentModel.js';

mongoose.connect('mongodb://localhost:27017/mysocialmediaAdvanced4');

const generateData = async () => {
  try {
    await mongoose.connection.dropDatabase();

    // Generate Users
    const users = [];
    for (let i = 0; i < 20; i++) {
      users.push(new User({
        name: faker.person.fullName(),
        role: 'user',
        dateOfBirth: faker.date.past({ years: 30, refDate: new Date(2000, 0, 1) }),
        email: faker.internet.email(),
        password: 'password123',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
      }));
    }
    // const insertedUsers = await User.insertMany(users);
    const insertedUsers = await User.create(users);

    // Generate Posts
    const posts = [];
    for (let i = 0; i < 40; i++) {
      const userId = faker.helpers.arrayElement(insertedUsers)._id;
      posts.push({
        userId: userId,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
      });
    }
    const insertedPosts = await Post.insertMany(posts);


    // Generate Likes
    const likes = [];
    for (let i = 0; i < 40; i++) {
      const userId = faker.helpers.arrayElement(insertedUsers)._id;
      const postId = faker.helpers.arrayElement(insertedPosts)._id;
      const likestring = `${postId.toString()}${userId.toString()}`;
      likes.push({
        userId: userId,
        postId: postId,
        likestring: likestring
      });
    }
    await Like.insertMany(likes);

    // Generate Comments
    const comments = [];
    for (let i = 0; i < 60; i++) {
      const userId = faker.helpers.arrayElement(insertedUsers)._id;
      const postId = faker.helpers.arrayElement(insertedPosts)._id;
      comments.push({
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
