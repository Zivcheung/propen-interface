import Vue from 'vue';
import Router from 'vue-router';
import gallery from 'src/pages/gallery';
import signIn from 'src/pages/signIn';
import signUp from 'src/pages/signUp';
import theater from 'src/pages/theater';
import research from 'src/pages/research';
import exhibitionPool from 'src/pages/exhibitionPool';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'gallery',
      component: gallery,
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: signIn,
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: signUp,
    },
    {
      path: '/exhibitionPool',
      name: 'exhibitionPool',
      component: exhibitionPool,
    },
    {
      path: '/theater',
      name: 'theater',
      component: theater,
    },
    {
      path: '/research',
      name: 'research',
      component: research,
    },
  ],
});
