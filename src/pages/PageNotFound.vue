<template>
  <div class="col-full" :class="$style.centered">
    <h1 :class="$style.headingLarge">Not Found!</h1>
    <p :class="$style.textLarge">
      Oops, halaman tidak tersedia, silahkan menuju
      <router-link :to="{name : 'Home'}">halaman Home</router-link>
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style module>
.headingLarge {
  font-size: 100px;
}
.textLarge {
  font-size: 50px;
  font-weight: lighter;
}
.centered {
  text-align: center;
}
</style>