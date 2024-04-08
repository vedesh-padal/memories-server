import PostMessage from '../models/postMessage.js'
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {

    const { page } = req.query;

    try {

        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;  // get the starting index of every page
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);   // this will give the newest posts first
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    }   catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// NOTE: 
// query ->  /posts?page=1  ->  page = 1        [ for querying data / search ]
// params ->  /posts/:id  ->  id = id     ex:  /posts/123   ->   id = 123   [ for getting specific resource ]

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    }   catch (error)   {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, 'i');     // 'i'  => ignoreCase

        const posts = await PostMessage.find({
          $or: [{ title }, 
                { 
                    tags: { 
                        $in: tags.split(",") 
                    } 
                }
            ],
        });

        res.json({ data: posts });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
    try {
        await newPost.save();
        res.status(201).json(newPost);
    }   catch (error)   {
        res.status(409).json({ message: error.message })
    }

}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))  return res.status(404).send('No post with that ID');

    // new: true is to receive the updated version of the post
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id))  return res.status(404).send('No post with that ID');

    await PostMessage.findOneAndDelete({ _id: id });

    res.json({ message: 'Post deleted successfully!' });

}

export const likePost = async (req, res) => {
    const { id } = req.params;
    
    if (!req.userId)    return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id))  return res.status(404).send('No post with that ID');

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    // if not liked the post, then like the post
    if (index === -1)   {
        post.likes.push(req.userId)
    }   else {
        // if that post is already liked, then it will be disliked
        post.likes = post.likes.filter((id) => id !== String(req.userId));  // will return the array of all the persons who liked the post except the current user
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}