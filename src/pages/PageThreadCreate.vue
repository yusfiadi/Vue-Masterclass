<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new thread in
      <i>{{forum.name}}</i>
    </h1>
    <thread-editor ref="editor" @save="save" :cancel="cancel"></thread-editor>
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
    forumId: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      saved: false
    };
  },
  computed: {
    forum() {
      return this.$store.state.forums[this.forumId];
    },
    hasUnsavedChanges() {
      return (
        (this.$refs.editor.form.title || this.$refs.editor.form.text) &&
        !this.saved
      );
    }
  },
  mixins: [asyncDataStatus],
  methods: {
    save({ title, text }) {
      // dispatch action
      this.$store
        .dispatch("createThread", {
          forumId: this.forum[".key"],
          title,
          text
        })
        .then(thread => {
          this.saved = true;
          this.$router.push({
            name: "ThreadShow",
            params: { id: thread[".key"] }
          });
        });
    },
    cancel() {
      this.$router.push({ name: "Forum", params: { id: this.forum[".key"] } });
    }
  },
  created() {
    this.$store.dispatch("fetchForum", { id: this.forumId }).then(() => {
      // buat nampilin template kalau data udah ada di state
      this.asyncDataStatus_fetched();
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Apakah kamu yakin ingin meninggalkan halaman ini? Jika iya, data yang telah kamu masukkan akan hilang."
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