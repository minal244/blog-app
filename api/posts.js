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
    `SELECT p.*, (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
     FROM posts p WHERE p.username = ? ORDER BY p.created_at DESC`,
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
    `SELECT p.*, (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
     FROM posts p ORDER BY p.created_at DESC`,
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
     SET title = ?, content = ?, image = ?, updated_at = CURRENT_TIMESTAMP
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

// GET LIKE STATUS
router.get('/:id/like-status', authMiddleware, (req, res) => {
  db.get(
    `SELECT id FROM likes WHERE post_id = ? AND username = ?`,
    [req.params.id, req.user.username],
    (err, row) => {
      res.json({ liked: !!row })
    }
  )
})

// TOGGLE LIKE
router.post('/:id/like', authMiddleware, (req, res) => {
  const { id } = req.params
  const { username } = req.user

  db.get(`SELECT id FROM likes WHERE post_id = ? AND username = ?`, [id, username], (err, row) => {
    if (row) {
      db.run(`DELETE FROM likes WHERE post_id = ? AND username = ?`, [id, username], () => {
        db.get(`SELECT COUNT(*) as count FROM likes WHERE post_id = ?`, [id], (err, r) => {
          res.json({ liked: false, count: r.count })
        })
      })
    } else {
      db.run(`INSERT INTO likes (post_id, username) VALUES (?, ?)`, [id, username], () => {
        db.get(`SELECT COUNT(*) as count FROM likes WHERE post_id = ?`, [id], (err, r) => {
          res.json({ liked: true, count: r.count })
        })
      })
    }
  })
})

// GET COMMENTS
router.get('/:id/comments', (req, res) => {
  db.all(
    `SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Error fetching comments' })
      res.json(rows)
    }
  )
})

// ADD COMMENT
router.post('/:id/comments', authMiddleware, (req, res) => {
  const { content } = req.body
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' })
  }

  db.run(
    `INSERT INTO comments (post_id, username, content) VALUES (?, ?, ?)`,
    [req.params.id, req.user.username, content.trim()],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error saving comment' })
      db.get(`SELECT * FROM comments WHERE id = ?`, [this.lastID], (err, row) => {
        res.json(row)
      })
    }
  )
})

// DELETE COMMENT
router.delete('/:id/comments/:commentId', authMiddleware, (req, res) => {
  db.run(
    `DELETE FROM comments WHERE id = ? AND username = ?`,
    [req.params.commentId, req.user.username],
    function(err) {
      if (this.changes === 0) return res.status(403).json({ message: 'Forbidden' })
      res.json({ message: 'Deleted' })
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
