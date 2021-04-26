import Vue from "vue";
import VueRouter from "vue-router";

import Addresses from "../views/Addresses.vue";
import Home from "../views/Home.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/addresses",
    name: "Addresses",
    component: Addresses
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
