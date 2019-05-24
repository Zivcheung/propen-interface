<template>
  <section class="window-page-wp signpage">
    <div class="signup">
      <div class="signup__logo">®</div>
      <div class="signup__form">
        <el-form>
          <el-form-item label="Email">
            <el-input
            v-model="account.email"
            auto-complete
            placeholder="Email">
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
        @click="submitFormHandler">Login</el-button>
      <el-button class="signup__shortcutbtn"
        type="text" @click="$router.push('/signup')">Signup here
        <i class='fas fa-heart'></i>
      </el-button>
    </div>
  </section>
</template>

<script>
import topNav from 'src/components/common/topNavigation';

export default {
  name: 'sign-in',
  components: {
    topNav,
  },
  data() {
    return {
      account: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    submitFormHandler() {
      this.$$axios.post('/login', {
        email: this.account.email,
        password: this.account.password,
      })
        .then((res) => {
          const { data } = res;
          if (data.message === 'success') {
            this.$store.commit('setLogin', true);
            this.$store.commit('setUserInfo', {
              userIcon: data.userIcon,
              username: data.username,
            });
            this.$router.push('/');
          }
        })
        .catch(err => alert('login failed'))
    },
  },
};
</script>

<style src="@/signup.css"></style>

