const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./db')

const router = express.Router()
const SECRET = process.env.JWT_SECRET

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

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ message: 'Invalid username' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  const hashed = await bcrypt.hash(password, 10)

  db.run(
    `INSERT INTO users (username, email, password)
     VALUES (?, ?, ?)`,
    [username.trim(), email.trim().toLowerCase(), hashed],
    function(err) {

      if (err) {
        return res.status(400).json({ message: 'User exists' })
      }

      const token = jwt.sign(
        { id: this.lastID, username: username.trim(), email: email.trim().toLowerCase() },
        SECRET,
        { expiresIn: '1d' }
      )

      res.json({
        token,
        user: { id: this.lastID, username: username.trim(), email: email.trim().toLowerCase() }
      })
    }
  )
})

// CHECK USERNAME AVAILABILITY
router.get('/check-username', (req, res) => {

  const { username } = req.query

  if (!username) {
    return res.json({ available: false })
  }

  db.get(
    `SELECT id FROM users WHERE username = ?`,
    [username],
    (err, row) => {
      res.json({ available: !row })
    }
  )
})

// LOGIN
router.post('/login', (req, res) => {

  const { identifier, password } = req.body

  if (!identifier || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  db.get(
    `SELECT * FROM users WHERE username = ? OR email = ?`,
    [identifier, identifier],
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

  const { username } = req.body

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ message: 'Invalid username' })
  }

  db.run(
    `UPDATE users SET username = ? WHERE email = ?`,
    [username.trim(), req.user.email],
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

  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  db.get(
    `SELECT password FROM users WHERE email = ?`,
    [req.user.email],
    async (err, user) => {

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const valid = await bcrypt.compare(currentPassword, user.password)

      if (!valid) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      const hashed = await bcrypt.hash(newPassword, 10)

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
    }
  )
})

module.exports = router
