<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <h1>{{ category.name }}</h1>
    <category-list-item :category="category"></category-list-item>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CategoryListItem from "@/components/CategoryListItem";
import asyncDataStatus from "@/mixins/asyncDataStatus";

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
  mixins: [asyncDataStatus],
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
    this.fetchCategory({ id: this.id })
      .then(category => this.fetchForums({ ids: category.forums }))
      .then(() => {
        // buat nampilin template kalau data udah ada di state
        this.asyncDataStatus_fetched();
      });
  }
};
</script>

<style>
</style>