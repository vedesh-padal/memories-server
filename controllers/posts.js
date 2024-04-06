import PostMessage from '../models/postMessage.js'
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find()

        console.log(postMessages);
        res.status(200).json(postMessages);
    }   catch (error) {
        res.status(400).json({ message: error.message });
    }

};

export const createPost = async (req, res) => {
    const post = req.body;
    console.log(post);
    const newPost = new PostMessage(post)


    try {
        await newPost.save();
        res.status(201).json(newPost);
    }   catch (error)   {
        res.status(409).json({message: error.message })
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