<template>
  <div class="col-full">
    <h2>Welcome to the Forum</h2>
    <category-list :categories="categories"></category-list>
  </div>
</template>

<script>
import sourceData from "@/data.json";
import CategoryList from "@/components/CategoryList";

console.log(sourceData);
export default {
  components: {
    CategoryList
  },
  data() {
    return {
      categories: Object.values(sourceData.categories) // Diubah ke Array
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
