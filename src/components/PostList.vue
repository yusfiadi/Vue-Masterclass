<template>
  <div class="post-list">
    <post-list-item v-for="post in posts" :post="post" :key="post['.key']"></post-list-item>
  </div>
</template>

<script>
import PostListItem from "./PostListItem";
export default {
  components: {
    PostListItem
  },
  props: {
    posts: {
      required: true,
      type: Array
    }
  }
};
</script>

<style>
</style>