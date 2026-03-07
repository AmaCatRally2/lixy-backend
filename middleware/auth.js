const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Tokenı header'dan al
  const token = req.header('x-auth-token');

  // Token yoksa hata dön
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Tokenı doğrula
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};