<template>
  <div class="container">

    <h1>All Blogs</h1>

    <p v-if="loading" class="centered-state">Loading blogs...</p>

    <template v-else>
      <p v-if="posts.length === 0" class="centered-state">No blogs published yet.</p>

      <template v-else>
      <input
        v-model="search"
        class="search-input"
        placeholder="Search blogs..."
        @input="page = 1"
      />

      <p v-if="filteredPosts.length === 0" class="centered-state">No results for "{{ search }}"</p>

      <div v-else class="sort-bar">
        <label for="sort">Sort by:</label>
        <select id="sort" v-model="sortBy">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">A → Z</option>
        </select>
      </div>

      <BlogCard
        v-for="post in paginatedPosts"
        :key="post.id"
        :post="post"
      />

      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="page === 1" @click="page--">← Prev</button>
        <span>{{ page }} / {{ totalPages }}</span>
        <button :disabled="page === totalPages" @click="page++">Next →</button>
      </div>
      </template>
    </template>

  </div>
</template>

<script>
import BlogCard from '~/components/BlogCard.vue'

export default {

  components: { BlogCard },

  data() {
    return {
      posts: [],
      loading: false,
      page: 1,
      perPage: 5,
      sortBy: 'newest',
      search: ''
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
    },
    totalPages() {
      return Math.ceil(this.filteredPosts.length / this.perPage)
    },
    paginatedPosts() {
      const start = (this.page - 1) * this.perPage
      return this.sortedPosts.slice(start, start + this.perPage)
    }
  },

  watch: {
    sortBy() { this.page = 1 },
    search() { this.page = 1 }
  },

  async mounted() {

    this.loading = true

    try {
      const res = await this.$axios.get('/posts')
      this.posts = res.data
    } catch {
      this.$toast.error('Failed to load posts')
    }

    this.loading = false

  }

}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
}

.pagination span {
  font-size: 14px;
  color: #6b7280;
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
  border-color: #2f8274;
}

.sort-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6b7280;
}

.sort-bar select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: white;
}
</style>
