import jwt from 'jsonwebtoken';

const auth = async(req, res, next) => {
    try {
        const token = req.headers.Authorization.split(' ')[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth)  {
            // must put the SECRET in the .env file
            decodedData = jwt.verify(token, 'Ved@123');

            req.userId = decodedData?.id;   // re-check here
        }   else {
            decodedData = jwt.decode(token);
            
            req.userId = decodedData?.id;   // re-check here
        }
    }   catch (error) {
        console.log(error);
    }
}

export default auth;