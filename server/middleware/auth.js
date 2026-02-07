import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    // Get token
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' })
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' })
  }
}
