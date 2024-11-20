<template>
  <div>
    <Post
      v-for="item in posts"
      :key="item.id" :post="item"
      :is-title-link="true"
      :has-comments-link="true"
      class="mb-6.5 last:mb-0"
      @rate="ratePost($event, item.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Post from '../components/shared/fragments/post.vue'
import { usePostStore } from '../stores/post'

const postStore = usePostStore()
const posts = computed(() => postStore.posts)
const { ratePost, setRatedPosts } = postStore

setRatedPosts()
</script>

<script lang="ts">
export default {
  async beforeRouteEnter(_to, _from, next) {
    const postStore = usePostStore()
    const posts = await postStore.getPosts()
    if (posts)
      return next()
    return next(false)
  }
}
</script>
