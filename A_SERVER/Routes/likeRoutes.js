import express from 'express';
import Like from '../Models/likeModel.js';
import Post from '../Models/postModel.js';
import protect from '../Middlewares/authMiddleware.js';

// import User from '../Models/userModel.js'
// import Post from '../Models/postModel.js'

const router = express.Router();

// // Get all likes for a post
// router.get('/:_id', async (req, res) => {
//   try {
//     const likes = await Like.find({postId: req.params._id})
//     .populate('userId', 'name')
//     // console.log('likes', likes)
//     res.status(200).json(likes);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });


// Get all likes for a post
router.get('/:postId', protect, async (req, res) => {
  try {
    const likes = await Like.find({postId: req.params.postId})
    .populate('userId', 'name')
    
    // if (likes.length === 0) {
    //   return res.status(404).json({ message: 'No likes found for this post.' });
    // }
    
    res.status(200).json(likes);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


// Create a new like for a post
router.post('/:postId', protect, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const likestring = `${postId.toString()}${userId.toString()}`;

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ likestring });

    // if (existingLike) {
    //   const message = 'You have already liked this post';
    //   return res.status(400).json({ message });
    // }

    let userliked=true
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id)
      userliked=false
    }


    // Create a new like
    if (!existingLike) {
      await Like.create({ postId, userId, likestring });
      userliked=true
    }

    // Count the number of likes for the post
    const likeCount = await Like.countDocuments({ postId });

    // Update the likes count in the corresponding post
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      { likes: likeCount},
      { new: true }  // This option ensures the returned document is the updated one
    ).populate('userId', 'name'); // Populate userId with user name for better client-side rendering

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const updatedPostWithUserLiked = {
      ...updatedPost.toObject(),
      userliked
    };
  
  
    console.log('updatedPostWithUserLike', updatedPostWithUserLiked)
    res.status(201).json(updatedPostWithUserLiked);
  } catch (err) {
    console.error('Error creating like:', err);
    res.status(400).json({ message: err.message });
  }
});



export default router;
