<template>
  <div class="col-full push-top">
    <h2>Welcome to the Forum</h2>
    <category-list :categories="categories"></category-list>
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";

export default {
  components: {
    CategoryList
  },
  computed: {
    categories() {
      return Object.values(this.$store.state.categories); // Diubah ke Array
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
