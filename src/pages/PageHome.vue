<template>
  <div class="col-full">
    <h2>Welcome to the Forum</h2>
    <thread-list :threads="threads"></thread-list>
  </div>
</template>

<script>
import sourceData from "@/data.json";
import ThreadList from "@/components/ThreadList";

console.log(sourceData);
export default {
  components: {
    ThreadList
  },
  data() {
    return {
      threads: Object.values(sourceData.threads), // Diubah ke Array
      posts: sourceData.posts,
      users: sourceData.users
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
