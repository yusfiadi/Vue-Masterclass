<template>
  <div class="flex-grid">
    <h1>My Profile</h1>
    <!-- <user-profile-card v-if="!edit" :user="user"></user-profile-card>
    <user-profile-card-editor v-else :user="user"></user-profile-card-editor>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">{{ user.username }}'s recent activity</span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />
      <post-list :posts="userPosts"></post-list>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostList from "@/components/PostList";
import UserProfileCard from "@/components/UserProfileCard";
import UserProfileCardEditor from "@/components/UserProfileCardEditor";

export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      user: "authUser"
    }),
    userPosts() {
      if (this.user.posts) {
        return Object.values(this.$store.state.posts).filter(
          post => post.userId === this.user[".key"]
        );
      }
      return [];
    }
  },
  created() {
    this.$emit("ready");
  }
};
</script>

<style>
</style>