import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from  'dotenv';

import postRoutes from './routes/posts.js';

const app = express();
dotenv.config();

app.use(cors());

// configuring bodyParser so that the client can properly send the requests
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use('/posts', postRoutes)



// connecting to db (mongoose is being used here)
const PORT = process.env.PORT || 5000;

// useNewUrlParser: true indicating the use of the new connection string parser and useUnifiedTopology: true enabling the new connection management engine provided by the MongoDB driver.
mongoose.connect(process.env.CONNECTION_URL)   // the 2nd param as an object is for minimizing errors/warnings in the console, and this is deprecated: useUnifiedApology: true
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));


// mongoose.set('useFindAndModify', false);    // to make sure that we don't have warnings in the console

