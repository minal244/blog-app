<template>
  <div class="card">

    <h2>{{ post.title }}</h2>

    <p class="meta">
      By {{ post.email }} • {{ formattedDate }}
    </p>

    <p class="content">
      {{ post.content }}
    </p>

    <div v-if="editable" class="actions">
      <nuxt-link :to="`/edit/${post.id}`">
        Edit
      </nuxt-link>

      <button @click="$emit('delete')" class="delete">
        Delete
      </button>
    </div>

  </div>
</template>

<script>
export default {

  props: {
    post: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    formattedDate() {
      return new Date(this.post.created_at).toLocaleString()
    }
  }

}
</script>

<style scoped>
.meta {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
}

.content {
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 15px;
}

.delete {
  background: #ef4444;
}

.delete:hover {
  background: #dc2626;
}
</style>
