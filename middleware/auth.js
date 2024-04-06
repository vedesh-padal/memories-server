import jwt from 'jsonwebtoken';

const auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth)  {
            // must put the SECRET in the .env file
            decodedData = jwt.verify(token, 'Ved@123');
            req.userId = decodedData?.id;   // for jwt check (normal login)
            
        }   else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;   // for jwt check (google oauth login)
        }
        next();

    }   catch (error) {
        console.log(error);
    }
}

export default auth;