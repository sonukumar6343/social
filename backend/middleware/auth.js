const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  try {
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is missing',
      });
    }

    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing',
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }

     
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error in authenticateToken middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
