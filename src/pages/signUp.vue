<template>
  <section class="window-page-wp signpage">
    <div class="signup">
      <div class="signup__logo">®</div>
      <div class="signup__form">
        <el-form>
          <el-form-item label="Email">
            <el-input
            v-model="account.email"
            placeholder="Email">
            </el-input>
          </el-form-item>
          <el-form-item label="Username">
            <el-input
            v-model="account.username"
            placeholder="Username">
            </el-input>
          </el-form-item>
          <el-form-item label="Password"  placeholder="Enter Your Email">
            <el-input
            v-model="account.password"
            placeholder="Password"
            show-password>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-button class="signup__submitbtn"
        type="primary"
        @click="submitSignupFormHandler">Sign Up</el-button>
      <el-button class="signup__shortcutbtn"
        type="text" @click="$router.push('/signin')">Login here
        <i class='fas fa-heart'></i>
      </el-button>
    </div>
  </section>
</template>

<script>
import topNav from 'src/components/common/topNavigation';

export default {
  name: 'signUp',
  components: {
    topNav,
  },
  data() {
    return {
      account: {
        email: '',
        username: '',
        password: '',
      },
    };
  },
  methods: {
    submitSignupFormHandler() {
      this.$$axios.post('/signup', {
        email: this.account.email,
        username: this.account.username,
        password: this.account.password,
      })
        .then((res) => {
          const { data } = res;
          if (data.message === 'success') {
            this.$cookies.set('userStatus', 'login', 2 * 60 * 60 * 1000);
            this.$store.commit('setLogin', true);
            this.$store.commit('setUserInfo', {
              username: data.username,
            });
            this.$router.push('/');
          }
        })
        .catch(err => alert('something went wrong'))
    },
  },
};
</script>

<style src="@/signup.css"></style>

