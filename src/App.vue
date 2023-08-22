<!-- App.vue -->
<template>
    <div >
    <NavigationMenu />
    <div class="container" style="width:80%; background-color:rgb(247, 247, 230)">
    <router-view /> <!-- This will render the appropriate component based on the route -->
    </div>
    <FooterMenu />
  </div>
</template>

<script>
import NavigationMenu from "@/components/NavigationMenu.vue"; // Adjust the path as needed
import FooterMenu from "@/components/FooterMenu.vue"; // Adjust the path as needed

export default {
  components: {
    NavigationMenu, // Register the NavigationMenu component
    FooterMenu, // Register the NavigationMenu component
  },
};
</script>
