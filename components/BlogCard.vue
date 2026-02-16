<template>
  <div class="card">

    <img
      v-if="post.image"
      :src="post.image"
      class="blog-img"
    />

    <h3>{{ post.title }}</h3>

    <small>
      By {{ post.author }} |
      {{ post.date }}
    </small>

    <p>{{ post.content }}</p>

    <div v-if="editable" class="actions">

      <button
        class="btn"
        @click="$emit('edit')"
      >
        Edit
      </button>

      <button
        class="btn danger"
        @click="$emit('delete')"
      >
        Delete
      </button>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    post: Object,
    editable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.card {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.blog-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.actions {
  margin-top: 10px;
}

.btn {
  padding: 6px 12px;
  border: none;
  background: #4ca1af;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.btn:hover {
  opacity: 0.9;
}

.danger {
  background: #e74c3c;
}
</style>
