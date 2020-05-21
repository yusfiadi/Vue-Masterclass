<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>
    <thread-editor :title="thread.title" :text="text" @save="save" :cancel="cancel"></thread-editor>
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: {
    ThreadEditor
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    // dapetin text first post dari thread
    text() {
      const post = this.$store.state.posts[this.thread.firstPostId];
      return post ? post.text : null;
    }
  },
  methods: {
    save({ title, text }) {
      // dispatch action
      this.$store
        .dispatch("updateThread", {
          id: this.id,
          title,
          text
        })
        .then(thread => {
          this.$router.push({
            name: "ThreadShow",
            params: { id: this.id }
          });
        });
    },
    cancel() {
      this.$router.push({
        name: "ThreadShow",
        params: { id: this.id }
      });
    }
  },
  created() {
    this.$store.dispatch("fetchThread", { id: this.id }).then(thread => {
      this.$store.dispatch("fetchPost", { id: thread.firstPostId }).then(() => {
        // buat nampilin template kalau data udah ada di state
        this.asyncDataStatus_fetched();
      });
    });
  }
};
</script>

<style>
</style>