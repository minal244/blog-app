const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('./db')
const multer = require('multer')
const path = require('path')

const router = express.Router()
const SECRET = 'SUPER_SECRET_KEY'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

// Auth Middleware
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

// CREATE POST
router.post('/', authMiddleware, upload.single('image'), (req, res) => {

  const { title, content } = req.body

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null

  db.run(
    `INSERT INTO posts (title, content, image, username, email)
     VALUES (?, ?, ?, ?, ?)`,
    [title, content, imagePath, req.user.username, req.user.email],
    function(err) {

      if (err) {
        return res.status(500).json({ message: 'Error creating post' })
      }

      res.json({ id: this.lastID })
    }
  )
})

// GET ALL POSTS
router.get('/', (req, res) => {

  db.all(
    `SELECT * FROM posts ORDER BY created_at DESC`,
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({ message: 'Error fetching posts' })
      }

      res.json(rows)
    }
  )
})

// UPDATE POST
router.put('/:id', authMiddleware, (req, res) => {

  db.run(
    `UPDATE posts
     SET title = ?, content = ?
     WHERE id = ? AND username = ?`,
    [req.body.title, req.body.content, req.params.id, req.user.username],
    function(err) {

      if (this.changes === 0) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      res.json({ message: 'Updated' })
    }
  )
})

// DELETE POST
router.delete('/:id', authMiddleware, (req, res) => {

  db.run(
    `DELETE FROM posts
     WHERE id = ? AND username = ?`,
    [req.params.id, req.user.username],
    function(err) {

      if (this.changes === 0) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      res.json({ message: 'Deleted' })
    }
  )
})

module.exports = router
