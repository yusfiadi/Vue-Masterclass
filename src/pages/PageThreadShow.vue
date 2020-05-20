<template>
  <div v-if="thread && user" class="col-large push-top">
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
import firebase from "firebase";
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import { countObjectProperties } from "@/utils";
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
    firebase
      .database()
      .ref("threads")
      .child(this.id)
      .once("value", snapshot => {
        const thread = snapshot.val();
        this.$store.commit("setThread", {
          threadId: snapshot.key,
          thread: { ...thread, ".key": snapshot.key }
        });
        // fetch user
        firebase
          .database()
          .ref("users")
          .child(thread.userId)
          .once("value", snapshot => {
            const user = snapshot.val();
            this.$store.commit("setUser", {
              userId: snapshot.key,
              user: { ...user, ".key": snapshot.key }
            });
          });
        Object.keys(thread.posts).forEach(postId => {
          // fetch post
          firebase
            .database()
            .ref("posts")
            .child(postId)
            .once("value", snapshot => {
              const post = snapshot.val();
              this.$store.commit("setPost", {
                postId: snapshot.key,
                post: { ...post, ".key": snapshot.key }
              });
              // fetch user
              firebase
                .database()
                .ref("users")
                .child(post.userId)
                .once("value", snapshot => {
                  const user = snapshot.val();
                  this.$store.commit("setUser", {
                    userId: snapshot.key,
                    user: { ...user, ".key": snapshot.key }
                  });
                });
            });
        });
      });
  }
};
</script>

<style>
</style>