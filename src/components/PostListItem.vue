<template>
  <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{ user.name }}</a>
      <a href="#">
        <img :src="user.avatar" alt class="avatar-large" />
      </a>
      <p class="desktop-only text-small">{{ userPostsCount }} posts</p>
    </div>
    <div class="post-content">
      <div>{{ post.text }}</div>
    </div>
    <div class="post-date tex-faded">
      <app-date :timestamp="post.publishedAt"></app-date>
    </div>
  </div>
</template>

<script>
// import moment from "moment";
import appDate from "./AppDate";
import { countObjectProperties } from "@/utils";
export default {
  components: {
    appDate
  },
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  computed: {
    user() {
      return this.$store.state.users[this.post.userId];
    },
    userPostsCount() {
      return countObjectProperties(this.user.posts);
    }
  }
  // filters: {
  //   humanFriendlyDate(date) {
  //     return moment.unix(date).format("MMMM Do YYYY, h:mm:ss a");
  //   },
  //   diffTimeForHuman(date) {
  //     return moment.unix(date).fromNow();
  //   }
  // }
};
</script>

<style>
</style>