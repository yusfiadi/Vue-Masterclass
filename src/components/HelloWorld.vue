<template>
  <div>
    <h1>Welcome to the Forum!</h1>
    <div v-for="thread in threads" :key="thread">
      <h2>{{ thread.title}}</h2>
      <div v-for="postId in thread.posts" :key="postId">
        <p>{{ users[posts[postId].userId].name }}</p>
        <p>{{ posts[postId].text }}</p>
      </div>
      <p>===========================================</p>
    </div>
  </div>
</template>

<script>
import sourceData from "@/data.json";
console.log(sourceData);
export default {
  name: "HelloWorld",
  data() {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      users: sourceData.users
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
