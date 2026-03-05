const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('./db')
const multer = require('multer')
const path = require('path')

const router = express.Router()
const SECRET = process.env.JWT_SECRET

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
router.post('/', authMiddleware, upload.array('images', 10), (req, res) => {

  const { title, content } = req.body

  const imagePaths = req.files && req.files.length > 0
    ? JSON.stringify(req.files.map(f => `/uploads/${f.filename}`))
    : null

  db.run(
    `INSERT INTO posts (title, content, image, username, email)
     VALUES (?, ?, ?, ?, ?)`,
    [title, content, imagePaths, req.user.username, req.user.email],
    function(err) {

      if (err) {
        return res.status(500).json({ message: 'Error creating post' })
      }

      res.json({ id: this.lastID })
    }
  )
})

// GET MY POSTS
router.get('/mine', authMiddleware, (req, res) => {

  db.all(
    `SELECT * FROM posts WHERE username = ? ORDER BY created_at DESC`,
    [req.user.username],
    (err, rows) => {

      if (err) {
        return res.status(500).json({ message: 'Error fetching posts' })
      }

      res.json(rows)
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

// GET SINGLE POST
router.get('/:id', (req, res) => {

  db.get(
    `SELECT * FROM posts WHERE id = ?`,
    [req.params.id],
    (err, row) => {

      if (err) {
        return res.status(500).json({ message: 'Error fetching post' })
      }

      if (!row) {
        return res.status(404).json({ message: 'Post not found' })
      }

      res.json(row)
    }
  )
})

// UPDATE POST
router.put('/:id', authMiddleware, upload.array('newImages', 10), (req, res) => {

  const existing = req.body.existingImages ? JSON.parse(req.body.existingImages) : []
  const added = req.files && req.files.length > 0
    ? req.files.map(f => `/uploads/${f.filename}`)
    : []
  const allImages = [...existing, ...added]
  const imagePaths = allImages.length > 0 ? JSON.stringify(allImages) : null

  db.run(
    `UPDATE posts
     SET title = ?, content = ?, image = ?
     WHERE id = ? AND username = ?`,
    [req.body.title, req.body.content, imagePaths, req.params.id, req.user.username],
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
