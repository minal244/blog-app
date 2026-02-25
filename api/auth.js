const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./db')

const router = express.Router()
const SECRET = 'SUPER_SECRET_KEY'

// Middleware
function authMiddleware(req, res, next) {

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// REGISTER
router.post('/register', async (req, res) => {

  const { username, email, password } = req.body

  const hashed = await bcrypt.hash(password, 10)

  db.run(
    `INSERT INTO users (username, email, password)
     VALUES (?, ?, ?)`,
    [username, email, hashed],
    function(err) {

      if (err) {
        return res.status(400).json({ message: 'User exists' })
      }

      res.json({ message: 'User created' })
    }
  )
})

// LOGIN
router.post('/login', (req, res) => {

  const { username, password } = req.body

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const valid = await bcrypt.compare(password, user.password)

      if (!valid) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        SECRET,
        { expiresIn: '1d' }
      )

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      })
    }
  )
})

// UPDATE PROFILE
router.put('/update', authMiddleware, (req, res) => {

  db.run(
    `UPDATE users SET username = ? WHERE email = ?`,
    [req.body.username, req.user.email],
    function(err) {

      if (err) {
        return res.status(500).json({ message: 'Error updating' })
      }

      res.json({ message: 'Profile updated' })
    }
  )
})

// CHANGE PASSWORD
router.put('/change-password', authMiddleware, async (req, res) => {

  const hashed = await bcrypt.hash(req.body.password, 10)

  db.run(
    `UPDATE users SET password = ? WHERE email = ?`,
    [hashed, req.user.email],
    function(err) {

      if (err) {
        return res.status(500).json({ message: 'Error updating password' })
      }

      res.json({ message: 'Password updated' })
    }
  )
})

module.exports = router
