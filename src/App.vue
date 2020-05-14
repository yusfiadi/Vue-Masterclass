<template>
  <div id="app">
    <div class="container">
      <img src="./assets/logo.png" />
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
@import "assets/css/style.css";
</style>
