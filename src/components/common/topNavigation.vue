<template>
    <header class="top-nav">
      <div class="top-nav__logo" @click="linkTo('gallery')">
        <span></span>
        PROPEN
      </div>
      <section class="top-nav__manu">
        <div class="top-nav__manu-item" @click="linkTo('gallery')">
            Gallery
        </div>
        <div class="top-nav__manu-item" @click="linkTo('exhibitionPool')">
            Exibition Pool
        </div>
        <div class="top-nav__manu-item" @click="linkTo('theater')">
            Theater
        </div>
        <div class="top-nav__manu-item" @click="linkTo('research')">
            Research
        </div>
        </section>
        <section class="top-nav__account">
          <template v-if="auth">
            <div class="top-nav__account-msg">
                <span></span>
            </div>
            <section class="top-nav__account-avatar">
                <span></span>
                <!-- dropdown's show behav is defined in css -->
                <section class="top-nav__account-avatar-dropdown">
                    <div class="top-nav__accunt-a-d-link">Personal Board</div>
                    <div class="top-nav__accunt-a-d-link">Profile</div>
                    <div class="top-nav__accunt-a-d-link">Account Setting</div>
                    <span class="top-nav__dropdown-spacer"></span>
                    <div class="top-nav__accunt-a-d-link">Log Out</div>
                </section>
            </section>
          </template>
          <template v-else>
            <div class="top-nav__account-link" @click="linkTo('signIn')">Sign In</div>
            <div class="top-nav__account-link" @click="linkTo('signUp')">Sign Up</div>
          </template>
        </section>
    </header>
</template>

<script>
export default {
  name: 'top-navigation',
  data() {
    return {
      // authentication
      auth: false,
    };
  },
  methods: {
    // events
    linkTo(name) {
      console.log(`jump to ${name}`);
      this.$router.push({ name });
    },
    // methods
  },
};
</script>

<style src="@/topNav.css"></style>
