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
          <template v-if="login">
            <!-- <div class="top-nav__account-msg">
                <span></span>
            </div> -->
            <section class="top-nav__account-avatar">
                <div class="top-nav__account-avatar-img">
                  <img :src="userIcon">
                </div>
                <!-- dropdown's show behav is defined in css -->
                <section class="top-nav__account-avatar-dropdown">
                    <el-button type="text" @click="$router.push('/dashboard')" >Personal Board</el-button>
                    <el-button type="text">Profile</el-button>
                    <el-button type="text">Account Setting</el-button>
                    <span class="top-nav__dropdown-spacer"></span>
                    <el-button type="text" @click="logoutHandler">Log Out</el-button>
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
import { mapState } from 'vuex';

export default {
  name: 'top-navigation',
  data() {
    return {
      // authentication
      auth: false,
    };
  },
  computed: {
    ...mapState([
      'login',
    ]),
    userIcon() {
      return this.$store.userIcon ? this.$store.userIcon : require('src/assets/defaultUserIcon.png');
    },
  },
  methods: {
    // events
    linkTo(name) {
      console.log(`jump to ${name}`);
      this.$router.push({ name });
    },
    logoutHandler() {
      this.$$axios.get('/logout')
        .then((res) => {
          if (res.data.message === 'success') {
            this.$router.push('/');
            this.$store.commit('clearUser');
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    // methods
    checkUserStatus() {
      return this.$cookies.get('userStatus') === 'login';
    },

  },
  mounted() {
  },
};
</script>

<style src="@/topNav.css"></style>
