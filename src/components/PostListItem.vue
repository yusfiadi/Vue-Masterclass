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
      <div>
        <div v-if="!editing">{{ post.text }}</div>
        <div v-else>
          <PostEditor :post="post" @save="editing = false" />
        </div>
      </div>
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
import PostEditor from "./PostEditor";
export default {
  components: {
    appDate,
    PostEditor
  },
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      editing: true
    };
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