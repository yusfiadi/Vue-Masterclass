<template>
  <div class="post">
    <div class="user-info">
      <a href="#" class="user-name">{{ user.name }}</a>
      <a href="#">
        <img :src="user.avatar" alt class="avatar-large" />
      </a>
      <p class="desktop-only text-small">{{ userThreadsCount }} threads</p>
      <p class="desktop-only text-small">{{ userPostsCount }} posts</p>
    </div>
    <div class="post-content">
      <template v-if="!editing">
        <div>{{ post.text }}</div>
        <a
          @click.prevent="editing=true"
          v-if="!editing"
          href="#"
          style="margin-left:auto"
          class="link-unstyled"
          title="Make a change"
        >
          <i class="fa fa-pencil"></i>
        </a>
      </template>

      <div v-else>
        <post-editor :post="post" @save="editing = false" @cancel="editing = false"></post-editor>
      </div>
    </div>
    <div class="post-date tex-faded">
      <div v-if="post.edited" class="edition-info">edited</div>
      <app-date :timestamp="post.publishedAt"></app-date>
    </div>
  </div>
</template>

<script>
// import moment from "moment";
import appDate from "./AppDate";
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
      editing: false
    };
  },
  computed: {
    user() {
      return this.$store.state.users[this.post.userId];
    },
    userPostsCount() {
      return this.$store.getters.userPostsCount(this.post.userId);
    },
    userThreadsCount() {
      return this.$store.getters.userThreadsCount(this.post.userId);
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