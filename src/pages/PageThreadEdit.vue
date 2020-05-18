<template>
  <div class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>
    <thread-editor :title="thread.title" :text="text" @save="save" :cancel="cancel"></thread-editor>
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";
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
  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    // dapetin text first post dari thread
    text() {
      return this.$store.state.posts[this.thread.firstPostId].text;
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
  }
};
</script>

<style>
</style>