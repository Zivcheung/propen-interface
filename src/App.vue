<template>
  <div id="app">
    <top-nav></top-nav>
    <router-view/>
  </div>
</template>

<script>
import topNav from 'src/components/common/topNavigation';

export default {
  name: 'App',
  components: {
    topNav,
  },
  mounted() {
    console.log(this.$cookies.get('userStatus'))
    if (this.$cookies.get('userStatus') === 'login') {
      this.$store.dispatch('requestUserInfo')
        .catch(err => alert(err));
    }
  },
};
</script>

<!-- add global css -->
<style src="@/main.css"></style>
<style src="@/reset.css"></style>




