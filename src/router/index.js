import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Home from "@/pages/PageHome";
import Category from "@/pages/PageCategory";
import ThreadShow from "@/pages/PageThreadShow";
import ThreadCreate from "@/pages/PageThreadCreate";
import ThreadEdit from "@/pages/PageThreadEdit";
import Forum from "@/pages/PageForum";
import Register from "@/pages/PageRegister";
import SignIn from "@/pages/PageSignIn";
import Profile from "@/pages/PageProfile";
import NotFound from "@/pages/PageNotFound";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/category/:id",
      name: "Category",
      component: Category,
      props: true
    },
    {
      path: "/forum/:id",
      name: "Forum",
      component: Forum,
      props: true
    },
    {
      path: "/thread/create/:forumId",
      name: "ThreadCreate",
      component: ThreadCreate,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: "/thread/:id",
      name: "ThreadShow",
      component: ThreadShow,
      props: true
    },
    {
      path: "/thread/:id/edit",
      name: "ThreadEdit",
      component: ThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: "/me",
      name: "Profile",
      component: Profile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: "/me/edit",
      name: "ProfileEdit",
      component: Profile,
      props: {
        edit: true
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: "/signin",
      name: "SignIn",
      component: SignIn,
      meta: { requiresGuest: true }
    },
    {
      path: "/signout",
      name: "SignOut",
      meta: { requiresAuth: true },
      beforeEnter(to, from, next) {
        store.dispatch("signOut").then(() => next({ name: "Home" }));
      }
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound
    }
  ],
  mode: "history"
});

router.beforeEach((to, from, next) => {
  console.log(`Navigating to ${to.name} from ${from.name}`);
  store.dispatch("initAuthentication").then(user => {
    // Untuk mengecek route nested yang match apakah ada meta field requiresAuth
    if (to.matched.some(route => route.meta.requiresAuth)) {
      // Protected route
      if (user) {
        next();
      } else {
        next({ name: "SignIn", query: { redirectTo: to.path } }); // to redirect users after logging in to the page they tried to visit
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) {
      // Protected route
      if (!user) {
        next();
      } else {
        next({ name: "Home" });
      }
    } else {
      next();
    }
  });
});

export default router;
