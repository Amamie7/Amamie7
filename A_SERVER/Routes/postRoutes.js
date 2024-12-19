import express from 'express';
import Post from '../Models/postModel.js';
import protect from '../Middlewares/authMiddleware.js';
import upload from '../Middlewares/filehandler.js'; 
import SetUploadsfilePathHandler from '../Middlewares/SetUploadsfilePathHandler.js'


const router = express.Router();

export const filesToPostPath = async (req, res, next) => {
  try {
    await SetUploadsfilePathHandler(req, './uploads/post');
    next();
  } catch (err) {
    next(err);
  }
};

// Get a post
router.get('/:postId', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('userId', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    // res.status(500).send(err.message);
    next(err);
  }
});


// Get a post
router.delete('/:postId', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId, {new: true})
    // const userId = req.user._id;

    if(!post){
        const error = new CustomError(`Post with ID: ${req.params.postId} is not available`, 404)
        return next(error)
    }

   
    if (req.user._id === post.userId.toString() || req.user.role === "superadmin"){
      await Post.findByIdAndDelete(req.params.postId )
    }
        //// unlink multiple files
        if(post.files){
            UnlinkMultipleFiles(post.files, req)
        }

  
    res.status(200).json({  
      status : "success",
      resource : "post",
      message: 'deleted'
  })
  } catch (err) {
    // res.status(500).send(err.message);
    next(err);
  }
});




// // Create a new post
// router.post('/', protect, async (req, res) => {
//   try {
//     req.body.userId = req.user._id
//     // console.log('req.body', req.body)

//     const post = await Post.create(req.body)
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });


// Route to create a new post
router.post('/', protect, filesToPostPath, upload.array('files', 10), async (req, res) => {
  try {
    const userId = req.user._id;  // This will be set by the `protect` middleware
    
    // If no files were uploaded, ensure that there's content to post
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded or no content provided' });
    }

    // Collect file metadata from uploaded files
    console.log("req.files", req.files);
    const files = req.files.map(file => ({
      filePath: file.path,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size
    }));

    // Create a new post document
    const newPost = new Post({
      userId,    // the ID of the logged-in user
      files,     // Array of files uploaded
      content: req.body.content  // Post content from the form
    });

    // Save the new post to the database
    await newPost.save();

    // Return the new post as a response
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send({ message: err.message });
  }
});

// // Create a new post and populate the response
// router.post('/populate',  protect, async (req, res) => {
//   try {
//     // Create the new post
//     req.body.userId = req.user._id
//     // console.log('req.body', req.body)
//     const newPost = await Post.create(req.body);

//     // Populate user details
//     const populatedPost = await Post.findById(newPost._id)
//     .populate('userId', 'name');

//     res.status(201).json(populatedPost);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });


// Create a new post and populate the response with file uploads
router.post('/populate', protect, filesToPostPath, upload.array('files', 10), async (req, res) => {
  try {
    const userId = req.user._id;

    // Collect file metadata from uploaded files
    const files = req.files.map(file => ({
      path: file.path,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size
    }));

    // Create a new post document
    const newPost = new Post({
      userId,
      files,
      content: req.body.content
    });

    // Save the new post to the database
    await newPost.save();

    // Populate user details
    const populatedPost = await Post.findById(newPost._id).populate('userId', 'name');

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send(err.message);
  }
});


// Get all post
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find()
    .sort({ date: -1 })
    .populate('userId', 'name')

    
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// // Route to get all posts
// router.get('/', protect, async (req, res) => {
//   try {
//     // Get the current user's ID and convert it to a string
//     const userId = req.user._id;
//     const userIdString = userId.toString();

//     // Start the aggregation pipeline on the Post collection
//     const posts = await Post.aggregate([
//       // Step 1: Lookup likes for each post using the likestring
//       {
//         $lookup: {
//           from: 'likes',  // The 'likes' collection to join with
//           let: { postId: '$_id' },  // Local variable 'postId' set to the '_id' of the current post document
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $eq: ['$likestring', { $concat: [{ $toString: '$$postId' }, userIdString] }]
//                   // Match documents where 'likestring' in 'likes' equals the concatenation of the post '_id' and the user's '_id'
//                 }
//               }
//             },
//             { $limit: 1 }  // Limit the results to 1 document for performance optimization
//           ],
//           as: 'userLike'  // Output array field name for matched likes
//         }
//       },
//       // Step 2: Add a field indicating if the current user has liked the post
//       {
//         $addFields: {
//           userliked: { $cond: { if: { $gt: [{ $size: '$userLike' }, 0] }, then: true, else: false } }
//           // Add 'userliked' field: true if the 'userLike' array has more than 0 elements, otherwise false
//         }
//       },
//       // Step 3: Lookup user details for each post
//       {
//         $lookup: {
//           from: 'users',  // The 'users' collection to join with
//           localField: 'userId',  // The 'userId' field in the 'posts' collection
//           foreignField: '_id',  // The '_id' field in the 'users' collection
//           as: 'userDetails'  // Output array field name for matched user details
//         }
//       },
//       { $unwind: '$userDetails' },  // Deconstruct the 'userDetails' array to a single object
//       // Step 4: Project the desired fields
//       {
//         $project: {
//           _id: 1,  // Include the '_id' field
//           userliked: 1,  // Include the 'userliked' field added in Step 2
//           userId: {
//             _id: '$userDetails._id',  // Include 'userDetails._id' as 'userId._id'
//             name: '$userDetails.name'  // Include 'userDetails.name' as 'userId.name'
//           },
//           likes: 1,  // Include the 'likes' field
//           comments: 1,  // Include the 'comments' field
//           content: 1,  // Include the 'content' field
//           date: 1  // Include the 'date' field
//         }
//       },
//       { $sort: { date: -1 } }  // Sort the posts by date in descending order
//     ]);

//     // Send the aggregated posts as the response
//     res.status(200).json(posts);
//   } catch (err) {
//     // Handle any errors
//     console.error('Error fetching posts:', err);
//     res.status(500).send(err.message);
//   }
// });



export default router;
