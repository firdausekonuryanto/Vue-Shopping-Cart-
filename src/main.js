// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router"; // Import createRouter and createWebHistory
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const app = createApp(App);

// import NavigationMenu from "@/components/NavigationMenu.vue";
import HomePage from "@/views/HomePage.vue";
import ProductsList from "@/views/ProductsList.vue";
import MembersPage from "@/views/MembersPage.vue";
import TransactionHistory from "@/views/TransactionHistory.vue";
import LoginForm from "@/views/LoginForm.vue";
import RegisterForm from "@/views/RegisterForm.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/products", component: ProductsList },
  { path: "/members", component: MembersPage },
  { path: "/history", component: TransactionHistory },
  { path: "/login", component: LoginForm },
  { path: "/register", component: RegisterForm },
  // Add more routes for other views/pages as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router); // Use the router as a plugin

app.mount("#app"); // Mount the app to the DOM
