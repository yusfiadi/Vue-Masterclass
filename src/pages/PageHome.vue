<template>
  <div class="col-full">
    <h2>Welcome to the Forum</h2>
    <forum-list :forums="forums"></forum-list>
  </div>
</template>

<script>
import sourceData from "@/data.json";
import ForumList from "@/components/ForumList";

console.log(sourceData);
export default {
  components: {
    ForumList
  },
  data() {
    return {
      forums: Object.values(sourceData.forums), // Diubah ke Array
      posts: sourceData.posts,
      users: sourceData.users
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
