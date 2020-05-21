<template>
  <div class="col-full push-top">
    <h2>Welcome to the Forum</h2>
    <category-list :categories="categories"></category-list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CategoryList from "@/components/CategoryList";

export default {
  components: {
    CategoryList
  },
  computed: {
    categories() {
      return Object.values(this.$store.state.categories); // Diubah ke Array
    }
  },
  methods: {
    ...mapActions(["fetchAllCategories", "fetchForums"])
  },

  // PageHome dan PageCategory saja yg menggunakan mapActions
  // kalau beforeCreate
  // this.fetchAllCategories is not a function
  created() {
    this.fetchAllCategories().then(categories => {
      categories.forEach(category =>
        this.fetchForums({
          ids: Object.keys(category.forums)
        })
      );
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
