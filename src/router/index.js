import Vue from 'vue';
import Router from 'vue-router';
import gallery from 'src/pages/gallery';
import signIn from 'src/pages/signIn';
import signUp from 'src/pages/signUp';
import theater from 'src/pages/theater';
import research from 'src/pages/research';
import exhibitionPool from 'src/pages/exhibitionPool';
import projectIntro from 'src/pages/projectIntro';
import projectNav from 'src/pages/projectNav';
import collaboration from 'src/pages/collaboration/mainPanel';
import compileCanvas from 'src/pages/collaboration/compileCanvas';
import projectContent from 'src/pages/projectContent';
import dashboard from 'src/pages/collaboration/dashboard';
import store from '../store';

Vue.use(Router);


const router = new Router({
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

    // secondary page
    {
      path: '/projectIntro/:id',
      name: 'projectIntro',
      component: projectIntro,
    },
    {
      path: '/projectNav/:id',
      name: 'projectNav',
      component: projectNav,
    },
    {
      path: '/projectContent',
      name: 'projectContent',
      component: projectContent,
    },
    // collaboration
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
    },
    {
      path: '/collaboration',
      name: 'collaboration',
      meta: {
        auth: 'required',
      },
      component: collaboration,
    },
    // todo: need to add dynamic link
    {
      path: '/compileCanvas',
      name: 'compileCanvas',
      meta: {
        requireAuth: 'required',
      },
      component: compileCanvas,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (store.state.userStatus !== 'login' &&
    to.meta.requireAuth) {
    next('/login');
    return;
  }
  next();
});

export default router;
