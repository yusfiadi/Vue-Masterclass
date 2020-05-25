<template>
  <div class="flex-grid">
    <user-profile-card v-if="!edit" :user="user"></user-profile-card>
    <user-profile-card-editor v-else :user="user"></user-profile-card-editor>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">{{ user.username }}'s recent activity</span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />
      <post-list :posts="userPosts"></post-list>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostList from "@/components/PostList";
import UserProfileCard from "@/components/UserProfileCard";
import UserProfileCardEditor from "@/components/UserProfileCardEditor";
import asyncDataStatus from "@/mixins/asyncDataStatus";

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
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({
      user: "authUser"
    }),
    userPosts() {
      return this.$store.getters.userPosts(this.user[".key"]);
    }
  },
  created() {
    this.$store
      .dispatch("fetchPosts", { ids: this.user.posts })
      .then(() => this.asyncDataStatus_fetched());
  }
};
</script>

<style>
</style>