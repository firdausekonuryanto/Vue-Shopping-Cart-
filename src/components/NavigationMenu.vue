<template>
  <div class="full-width-header">
      <div class="header">
        <div class="container" style="width: 80%; display: flex; align-items: center;">
        <div class="logo-container">
          <img
          src="http://localhost:5000/public/uploads/logoq.png"
          alt="Logo"
          style="width: 120px; height: 100px;"
        />
        </div>
        <div class="text-container">
          <h2 class="custom-font">T O K O - S u n r a t u</h2>
        <p><strong> Sedia : Segala Jenis Pakaian Wanita (Jubah, Atasan, Celana, Daster, Mukena, Dsb.) </strong><br> 
        Alamat : Stand Dalam Pasar - Jalan Raya Rogojampi NO. 144 Kode Pos : 68462</p>
        </div>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-dark custom-navbar" >
<div class="container" style="width:80%">
        <a class="navbar-brand" href="/">Sunratu Shop</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link">  <router-link to="/" style="color: rgb(255, 255, 255); text-decoration: none;">Home</router-link></a>
            </li>
            <li class="nav-item" v-if="userData && userData.is_staff">
              <a class="nav-link">  <router-link to="/products" style="color: rgb(255, 255, 255); text-decoration: none;">Products</router-link></a>
            </li>
            <li class="nav-item" v-if="!userData">
              <a class="nav-link">  <router-link to="/register" style="color: rgb(255, 255, 255); text-decoration: none;">Registrasi</router-link></a>
            </li>
            <li class="nav-item" v-if="userData && userData.is_staff">
              <a class="nav-link">  <router-link to="/members" style="color: rgb(255, 255, 255); text-decoration: none;">Members</router-link></a>
            </li>
            <li class="nav-item" v-if="!userData" >
              <a class="nav-link">  <router-link to="/login" style="color: rgb(255, 255, 255); text-decoration: none;">Login</router-link></a>
            </li>
            <li class="nav-item" v-if="userData" >
              <a class="nav-link">  <router-link to="/history" style="color: rgb(255, 255, 255); text-decoration: none;">History Transaksi</router-link></a>
            </li>
            <li class="nav-item" v-if="userData">
              <a class="nav-link" @click="logout" style="cursor: pointer; color: rgb(255, 255, 255);"  >Logout ({{ userData.username }}) </a>
            </li>
          </ul>
        </div>
      </div>
      </nav>
  </div>
</template>

<style>
.full-width-header {
  background: linear-gradient(90deg, rgb(3, 0, 0) 0%, rgb(77, 24, 24) 100%);
  color: aliceblue;
  height: auto;
}

.container {

}

.header {
  display: flex;
  align-items: center;
}

@font-face {
  font-family: 'MyCustomFont';
  src: url('http://localhost:5000/public/uploads/YouthTouchDemoRegular-4VwY.ttf') format('truetype');
}

.logo-container {
  margin-right: 20px; /* Add some spacing between the logo and text */
}

.logo-container img {
  display: block; /* Remove extra space below the image */
}

.text-container {
  color: rgb(255, 206, 127);
}

.text-container h2 {
  font-size: 54px; /* Adjust the font size for the heading */
  margin-bottom: -20px;
  font-family: 'MyCustomFont', sans-serif; /* Apply the custom font to the heading */
}

.text-container p {
  font-size: 16px; /* Adjust the font size for the paragraph */
  margin: 5px 0; /* Add some margin to the paragraph */
}

.custom-navbar {
  background-color: rgb(162, 108, 22); /* Replace with your desired color in hexadecimal or RGB format */
  width: 100%;
  height: 40px;
}

/* ... rest of the styles ... */
</style>

<script>
import axios from "axios";

export default {
  name: "NavigationMenu",
  methods: {
    getUserDataFromLocalStorage() {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      return null;
    },

    async logout() {
      try {
        await axios.post("http://localhost:5000/logout");
        localStorage.removeItem("userData");
        window.location.href = "/";
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
  computed: {
    userData() {
      return this.getUserDataFromLocalStorage();
    },
  },
  created() {
    this.getUserDataFromLocalStorage();
  },
};
</script>
