import jwt from 'jsonwebtoken';

const auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const isCustomAuth = token.length < 500;

        let decodedData;
        console.log('entered middleware on backed');
        if (token && isCustomAuth)  {

            // must put the SECRET in the .env file
            console.log('normal login');
            decodedData = jwt.verify(token, 'Ved@123');
            req.userId = decodedData?.id;   // for jwt check
            
        }   else {

            console.log('google login and before decoding');
            console.log('google sign in credential ')
            decodedData = jwt.decode(token);
            console.log('google login, after decoding and now will try to access google user specific id \'sub\'');
            console.log('decoded data: \n' + decodedData.payload);
            req.userId = decodedData?.sub;   // for google oauth
            console.log('sending user id: \n' + req.userId);
            console.log('google user specific id "sub" accessed');

        }
        next();

    }   catch (error) {
        console.log(error);
    }
    console.log('middleware went right!');
}

export default auth;