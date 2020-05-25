<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>
    <thread-editor ref="editor" :title="thread.title" :text="text" @save="save" @cancel="cancel"></thread-editor>
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
    },
    hasUnsavedChanges() {
      // this.saved is not required in this implementation because `this.thread.title` and `this.text` are reactive
      // Thus `hasUnsavedChanges` will automatically become false when the thread is updated
      return (
        this.$refs.editor.form.title !== this.thread.title ||
        this.$refs.editor.form.text !== this.text
      );
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
      this.$router.push({ name: "ThreadShow", params: { id: this.id } });
    }
  },
  created() {
    this.$store.dispatch("fetchThread", { id: this.id }).then(thread => {
      this.$store.dispatch("fetchPost", { id: thread.firstPostId }).then(() => {
        // buat nampilin template kalau data udah ada di state
        this.asyncDataStatus_fetched();
      });
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Are you sure you want to leave? Any unsaved changes will be lost!"
      );
      if (confirmed) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }
};
</script>

<style>
</style>