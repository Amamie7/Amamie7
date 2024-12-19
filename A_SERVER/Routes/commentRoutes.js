import express from 'express';
import Comment from '../Models/commentModel.js';
import Post from '../Models/postModel.js';
import protect from '../Middlewares/authMiddleware.js';


const router = express.Router();

// Get a post comments
router.get('/:postId', protect, async (req, res) => {
    try {
        const comments = await Comment.find({postId: req.params.postId})
        .populate('userId', 'name')
        // console.log('comments', comments)

        res.status(200).json(comments);
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
)

// router.post('/', async (req, res) => {
//     try {
//         const comments = await Comment.create(req.body)
//         res.status(201).json(comments);
//       } catch (err) {
//         res.status(400).send(err.message);
//       }
//     }
// )


// make a comment for a post
router.post('/:postId', protect, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const { comment } = req.body;

    // Create a new comment
    const newcomment = await Comment.create({ userId, postId, comment});

    // Count the number of comments for the post
    const commentCount = await Comment.countDocuments({ postId });

    // Update the comments count in the corresponding post
    await Post.findByIdAndUpdate(postId, { comments: commentCount });

    // Populate user details
    const populatedComment = await Comment.findById(newcomment._id).populate('userId', 'name');

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).send(err.message);
  }
});



router.delete('/:commentId', protect, async (req, res) => {
    try {
        const comments = await Comment.findByIdAndDelete(req.params.commentId)
        res.status(204).json({message:'Deleted'});
      } catch (err) {
        res.status(400).send(err.message);
      }
    }
)


router.put('/:commentId', protect, async (req, res) => {
    try {
        const comments = await Comment.findByIdAndUpdate(req.params.commentId, req.body)
        res.status(201).json(comments);
      } catch (err) {
        res.status(400).send(err.message);
      }
    }
)

export default router;
