<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <router-link
      :to="{name: 'ThreadEdit', id:'this.id'}"
      class="btn-green btn-small"
      tag="button"
    >Edit Thread</router-link>
    <p>
      By
      <a href="#" class="link-unstyled">{{ user.name }}</a>,
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
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import { countObjectProperties } from "@/utils";
import asyncDataStatus from "@/mixins/asyncDataStatus";

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
  mixins: [asyncDataStatus],
  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    user() {
      return this.$store.state.users[this.thread.userId];
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
      return countObjectProperties(this.thread.contributors);
    }
  },
  created() {
    // fetch thread
    this.$store
      .dispatch("fetchThread", { id: this.id })
      .then(thread => {
        // fetch user
        this.$store.dispatch("fetchUser", { id: thread.userId });
        return this.$store.dispatch("fetchPosts", {
          ids: Object.keys(thread.posts)
        });
      })
      .then(posts => {
        return Promise.all(
          posts.map(post => {
            this.$store.dispatch("fetchUser", { id: post.userId });
          })
        );
      })
      .then(() => {
        // buat nampilin template kalau data udah ada di state
        this.asyncDataStatus_fetched();
      });
  }
};
</script>

<style>
</style>