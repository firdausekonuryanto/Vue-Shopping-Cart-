<template>
    <div class="card mx-auto mt-5" style="max-width: 400px;">
      <div class="card-body">
        <h2 class="card-title text-center">Login</h2>
        <hr>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">Username</label>
            <input v-model="username" type="text" id="username" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="password" type="password" id="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-dark btn-block">Login</button>
        </form>
        <div v-if="showErrorAlert" class="alert alert-danger mt-3">
          Incorrect username or password. Please try again.
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "NavigationMenu",
  data() {
    return {
      username: "",
      password: "",
      showErrorAlert: false
    };
  },
  methods: {
    async handleSubmit() {
      const userData = {
        username: this.username,
        password: this.password,
      };

      try {
        const response = await axios.post("http://localhost:5000/login", userData);

        this.username = "";
        this.password = "";

        if (response.data && response.data.success) {
          const userDataToSave = {
            token: response.data.token,
            username: response.data.username,
            id_member: response.data.id_member,
            is_staff: response.data.is_staff,
          };
          const stringifiedUserData = JSON.stringify(userDataToSave);
          localStorage.setItem("userData", stringifiedUserData);
          window.location.href = "/";
        } 
      } catch (error) {
        this.showErrorAlert = true;
        console.error("Error logging in:", error);
      }
    },
    async logout() {
      try {
        await axios.post("http://localhost:5000/logout");
        localStorage.removeItem("userData");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
  computed: {
    userData() {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      return null;
    },
  },
  created() {
    if (this.userData) {
      console.log("Logged in on navigation as:", this.userData.username);
    }
  },
};
</script>
