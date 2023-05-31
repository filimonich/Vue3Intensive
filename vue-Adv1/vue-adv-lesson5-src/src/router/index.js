import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
];

const router = createRouter({
  history: process.isServer
    ? createMemoryHistory()
    : createWebHistory(process.env.BASE_URL),
  routes,
});

/* router.afterEach(to => {
  console.log(to.matched);
  if(to.matched.length > 0){
    let deep = to.matched[to.matched.length - 1];
    let page = deep.components?.default?.page;
    
    if(page !== undefined){
      document.title = page.title;
    }
  }
}); */

export default router;
