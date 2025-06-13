<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import router from "./router";

function goHome() {
  router.push("/home");
}
onMounted(() => {
  goHome();
});
</script>

<style>
</style>
