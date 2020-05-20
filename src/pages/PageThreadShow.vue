<template>
  <div>
    <div class="col-large push-top">
      <h1>{{ thread.title }}</h1>
      <router-link
        :to="{name: 'ThreadEdit', id:'this.id'}"
        class="btn-green btn-small"
        tag="button"
      >Edit Thread</router-link>
      <p>
        By
        <a href="#" class="link-unstyled">Robin</a>,
        <app-date :timestamp="thread.publishedAt"></app-date>.
        <span
          style="float:right; margin-top: 2px;"
          class="hide-mobile text-faded text-small"
        >{{ repliesCount }} replies by {{contributorsCount}} contributors</span>
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
  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    posts() {
      const postsIds = Object.values(this.thread.posts);
      return Object.values(this.$store.state.posts).filter(post =>
        postsIds.includes(post[".key"])
      );
    },
    repliesCount() {
      return this.$store.getters.threadRepliesCount(this.thread[".key"]);
    },
    contributorsCount() {
      // find the repies
      const replies = Object.keys(this.thread.posts)
        .filter(postId => postId !== this.thread.firstPostId)
        .map(postId => this.$store.state.posts[postId]);
      // get the userId
      const userIds = replies.map(post => post.userId);
      // count the unique ids
      // return userIds.filter((item, index) => index === userIds.indexOf(item))
      //   .length;

      // Versi ES6
      return [...new Set(userIds)].length;
    }
  }
  // sudah ada di PostEditor
  // methods: {
  //   addPost({ post }) {
  //     this.$store.dispatch("createPost", post);
  //   }
  // }
};
</script>

<style>
</style>