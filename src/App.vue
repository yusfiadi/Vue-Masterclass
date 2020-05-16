<template>
  <div id="app">
    <the-navbar></the-navbar>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";
export default {
  components: {
    TheNavbar
  }
};
</script>

<style>
@import "assets/css/style.css";
</style>
