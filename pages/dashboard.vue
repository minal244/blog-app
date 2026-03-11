<template>
  <div class="container">

    <div class="dashboard-header">

      <div>
        <h1>My Dashboard</h1>
        <p class="subtitle">
          Manage and edit your blogs
        </p>
      </div>

      <nuxt-link to="/create" class="create-btn">
        + Create Blog
      </nuxt-link>

    </div>

    <QuoteWidget />

    <p v-if="loading" class="centered-state">Loading your blogs...</p>

    <template v-else>
      <div v-if="posts.length === 0" class="centered-state">
        <p>No blogs yet.</p>
        <nuxt-link to="/create">Create your first blog →</nuxt-link>
      </div>

      <template v-else>
        <input
          v-model="search"
          class="search-input"
          placeholder="Search your blogs..."
        />

        <p v-if="filteredPosts.length === 0" class="centered-state">No results for "{{ search }}"</p>

        <template v-else>
          <div class="sort-bar">
            <label for="sort">Sort by:</label>
            <select id="sort" v-model="sortBy">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alpha">A → Z</option>
            </select>
          </div>

          <BlogCard
            v-for="post in sortedPosts"
        :key="post.id"
        :post="post"
        :editable="true"
        @delete="deletePost(post.id)"
      />
        </template>
      </template>
    </template>

    <!-- Delete confirmation modal -->
    <div v-if="confirmId !== null" class="modal-overlay" @click.self="confirmId = null">
      <div class="modal">
        <p>Delete this blog? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="confirmId = null">Cancel</button>
          <button class="confirm-btn" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard.vue'
import QuoteWidget from '~/components/QuoteWidget.vue'

export default {

  middleware: 'auth',
  components: { BlogCard, QuoteWidget },

  data() {
    return {
      posts: [],
      loading: false,
      sortBy: 'newest',
      search: '',
      confirmId: null
    }
  },

  computed: {
    filteredPosts() {
      const q = this.search.trim().toLowerCase()
      if (!q) return this.posts
      return this.posts.filter(p =>
        p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      )
    },
    sortedPosts() {
      const arr = [...this.filteredPosts]
      if (this.sortBy === 'oldest') {
        return arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      } else if (this.sortBy === 'alpha') {
        return arr.sort((a, b) => a.title.localeCompare(b.title))
      }
      return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  },

  async mounted() {

    this.loading = true
    try {
      const res = await this.$axios.get('/posts/mine')
      this.posts = res.data
    } catch {
      // 401 handled globally by axios interceptor
    }
    this.loading = false

  },

  methods: {

    deletePost(id) {
      this.confirmId = id
    },

    async confirmDelete() {
      const id = this.confirmId
      this.confirmId = null
      await this.$axios.delete(`/posts/${id}`)
      this.posts = this.posts.filter(p => p.id !== id)
      this.$toast.success('Blog deleted')
    }

  }

}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.subtitle {
  font-size: 14px;
  color: var(--color-muted);
}

.create-btn {
  background: var(--color-primary);
  padding: 10px 18px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
}

.create-btn:hover {
  background: var(--color-primary-dark);
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.sort-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--color-muted);
}

.sort-bar select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  padding: 28px 32px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal p {
  font-size: 15px;
  color: #111827;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 14px;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  background: var(--color-danger);
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 14px;
}

.confirm-btn:hover {
  background: var(--color-danger-dark);
}

</style>
