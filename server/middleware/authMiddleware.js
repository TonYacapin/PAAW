const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        console.log('this is authmiddleware: ' + JSON.stringify(req.user, null, 2)); // Pretty-print the user object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = authMiddleware;
