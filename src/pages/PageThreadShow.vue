<template>
  <div>
    <div class="col-large push-top">
      <h1>{{ thread.title }}</h1>
      <p>
        By
        <a href="#" class="link-unstyled">Robin</a>,
        <app-date :timestamp="thread.publishedAt"></app-date>.
        <span
          style="float:right; margin-top: 2px;"
          class="hide-mobile text-faded text-small"
        >3 replies by 3 contributors</span>
      </p>
      <post-list :posts="posts"></post-list>
      <post-editor :threadId="id"></post-editor>
      <!-- <post-editor @save="addPost" :threadId="id"></post-editor> -->
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
export default {
  components: {
    PostList,
    PostEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      thread: this.$store.state.threads[this.id],
      newPostText: ""
    };
  },
  computed: {
    posts() {
      const postsIds = Object.values(this.thread.posts);
      return Object.values(this.$store.state.posts).filter(post =>
        postsIds.includes(post[".key"])
      );
    }
  }
  // methods: {
  //   addPost({ post }) {
  //     this.$store.dispatch("createPost", post);
  //   }
  // }
};
</script>

<style>
</style>