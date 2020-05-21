<template>
  <div v-if="category" class="col-full">
    <h1>{{ category.name }}</h1>
    <category-list-item :category="category"></category-list-item>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CategoryListItem from "@/components/CategoryListItem";

export default {
  components: {
    CategoryListItem
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    category() {
      return this.$store.state.categories[this.id];
    }
  },
  methods: {
    ...mapActions(["fetchCategory", "fetchForums"])
  },
  // PageHome dan PageCategory saja yg menggunakan mapActions
  created() {
    this.fetchCategory({ id: this.id }).then(category => {
      this.fetchForums({
        ids: category.forums
      });
    });
  }
};
</script>

<style>
</style>