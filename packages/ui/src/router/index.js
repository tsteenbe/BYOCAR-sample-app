// SPDX-License-Identifier: MIT

import Vue from "vue";
import VueRouter from "vue-router";
import StartPage from "@/pages/StartPage/StartPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "StartPage",
    component: StartPage,
  },
  {
    path: "/dashboard",
    name: "DashboardPage",
    component: () => import("../pages/DashboardPage/DashboardPage.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
