<template>
  <div>

    <h1>Profile</h1>

    <!-- Analytics -->
    <div v-if="!loading && posts.length > 0" class="section-card">

      <h2 class="section-title">Your Stats</h2>

      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-value">{{ totalPosts }}</span>
          <span class="stat-label">Posts</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalLikes }}</span>
          <span class="stat-label">Likes</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalComments }}</span>
          <span class="stat-label">Comments</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalWords.toLocaleString() }}</span>
          <span class="stat-label">Words Written</span>
        </div>
      </div>

      <div v-if="mostLiked" class="most-popular">
        <span class="most-popular-label">Most popular</span>
        <nuxt-link :to="`/blog/${mostLiked.id}`" class="most-popular-title">
          {{ mostLiked.title }}
        </nuxt-link>
        <span class="most-popular-meta">{{ mostLiked.like_count }} likes · {{ mostLiked.comment_count }} comments</span>
      </div>

      <div>
        <p class="activity-label">Posting Activity (last 6 months)</p>
        <div class="chart">
          <div
            v-for="month in activityChart"
            :key="month.key"
            class="chart-col"
          >
            <div class="bar-wrap">
              <div
                class="bar"
                :style="{ height: month.height }"
                :title="`${month.count} post${month.count !== 1 ? 's' : ''}`"
              ></div>
            </div>
            <span class="bar-label">{{ month.label }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Account Settings -->
    <div class="section-card">
      <h2 class="section-title">Account Settings</h2>
      <ProfileForm />
      <ChangePassword />
    </div>

  </div>
</template>

<script>
import ProfileForm from '~/components/ProfileForm.vue'
import ChangePassword from '~/components/ChangePassword.vue'

export default {

  middleware: 'auth',
  components: { ProfileForm, ChangePassword },

  data() {
    return {
      posts: [],
      loading: false
    }
  },

  async mounted() {
    this.loading = true
    try {
      const res = await this.$axios.get('/posts/mine')
      this.posts = res.data
    } catch {
      // analytics silently skipped
    }
    this.loading = false
  },

  computed: {

    totalPosts() {
      return this.posts.length
    },

    totalLikes() {
      return this.posts.reduce((s, p) => s + (p.like_count || 0), 0)
    },

    totalComments() {
      return this.posts.reduce((s, p) => s + (p.comment_count || 0), 0)
    },

    totalWords() {
      return this.posts.reduce((s, p) => {
        const w = p.content.trim() ? p.content.trim().split(/\s+/).length : 0
        return s + w
      }, 0)
    },

    mostLiked() {
      if (!this.posts.length) return null
      return this.posts.reduce((max, p) =>
        (p.like_count || 0) > (max.like_count || 0) ? p : max
      , this.posts[0])
    },

    activityChart() {
      const now = new Date()
      const months = []

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = d.toLocaleString('en-US', { month: 'short' })
        const count = this.posts.filter(p => {
          const pd = new Date(p.created_at)
          return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
        }).length
        months.push({ label, key: `${d.getFullYear()}-${d.getMonth()}`, count })
      }

      const max = Math.max(...months.map(m => m.count), 1)
      return months.map(m => ({
        ...m,
        height: `${Math.round((m.count / max) * 100)}%`
      }))
    }

  }

}
</script>

<style scoped>
h1 {
  margin-bottom: 24px;
}

.section-card {
  background: white;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 20px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2f8274;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.most-popular {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0fdf9;
  border: 1px solid #d1fae5;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.most-popular-label {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.most-popular-title {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.most-popular-title:hover {
  color: #2f8274;
}

.most-popular-meta {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.activity-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 80px;
}

.chart-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: #2f8274;
  border-radius: 4px 4px 0 0;
  min-height: 3px;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 6px;
}

@media (max-width: 600px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>