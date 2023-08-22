<template>
    <div class="row text-center" style="padding: 10px">
      <div class="col">
        <template v-if="userData">
          <h2 >Welcome <span> {{ userData.username }}</span> to sunratu shop,</h2>
        </template>
        <template v-else>
        <h2>Welcome to sunratu shop,</h2>
        Please register for buying our product, just a litle minutes. Click Here to <a href="/register" class="blink_me"> Register</a>
        </template>
      <div class="container-body">

  <div class="product-list">
  <div v-for="(image, index) in images" :key="index" class="product">
    <img class="img-thumbnail rounded" :src="'http://localhost:5000/public/uploads/' + image.image" :alt="image.alt"   @click="openModal(image)"/>
    <h4>{{image.name }}</h4>
    <p>{{ formatPrice(image.price) }}</p>
    <button @click="addToCart(image)" v-if="userData" class="btn btn-dark">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-check mb-1" viewBox="0 0 16 16">
        <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
      Add to Cart
    </button>
    <button v-else class="btn btn-secondary">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-check mb-1" style="margin-right:5px" viewBox="0 0 16 16">
        <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
      <del>Add to Cart</del>
    </button>
  </div>
</div>
<!-- ------------------------------------ batas atas ------------------------ -->
  <hr>
  <h3>
    Kami juga bisa melayani pembelian secara online dengan cara sebagai berikut:
  </h3>
  <h5>
    Silahkan Pilih Baju kesayangan anda, screen gambar dan kirimkan<br />
    ke customer service kami
    <span class="blink_me">via WhatsApp: 0853 3832 1400</span>
  </h5>
</div>

<div v-if="cartItems.length > 0" style="position: absolute; top: 10px; right: 10px; background-color: rgb(236, 222, 174); padding: 10px; display: flex; align-items: center;">
  <form @submit="submitCart" style="margin-top: 20px;">
  <h3 style="margin: 0;">Cart Items</h3>
  <hr>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama Produk</th>
        <th>Harga</th>
        <th>Qty</th>
        <th>Subtotal</th>
        <th>Actions</th>
      </tr>
    </thead>
      <tbody>
        <tr v-for="(item, index) in cartItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td>
                  <input
                      class="form-control"
                      style="width: 80px"
                      type="number"
                      v-model="item.qty"
                      @input="handleQuantityChange(item)"
                      required
                    />
                  </td>
                  <td>{{ formatPrice(item.price * item.qty) }}</td>
                  <td>
                    <button class="btn btn-danger" @click="removeCartItem(index)">
                      Remove
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colspan="6">
                    <h4>Total: {{ formatPrice(totalSubtotal) }}</h4>
                  </td>
                </tr>
                <tr>
                  <td colspan="6">
                    <input type="file" required @change="handleImageChange" id="image" class="form-control" />
                  </td>
                </tr>
                <tr>
                  <td colspan="6">  <button type="submit" class="btn btn-primary">Submit Order</button></td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>

        <!-------------------------- start modal ------------------------ -->
        <div v-if="showModal" class="modal-backdrop">
  <div class="modal-content">
    <div class="modal-header">
      <h3>{{ formattedModalImageName }} </h3> <span style="margin-right:40px">{{ formatPrice(selectedModalImage.price) }}</span>
      <span class="close-button" @click="closeModal">&times;</span>
    </div>
    <img class="modal-image" :src="'http://localhost:5000/public/uploads/' + selectedModalImage.image" :alt="selectedModalImage.alt" />
  </div>
</div>

        <!-------------------------- end modal ------------------------ -->
      </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      currentIndex: 0,
      images: [],
      cartItems: [],
      selectedImage: null,
      showModal: false,
      selectedModalImage: null,
    };
  },
  methods: {

    convertToCamelCase(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      }).replace(/\s+/g, '');
    },

    openModal(image) {
    this.selectedModalImage = image;
    this.showModal = true;
  },

    closeModal() {
      this.selectedModalImage = null;
      this.showModal = false;
    },
    
    getUserDataFromLocalStorage() {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      return null;
    },
    
    async fetchImages() {
      try {
        const response = await axios.get("http://localhost:5000/api/images"); 
        this.images = response.data; 
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },

  formatPrice(price) {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice)) {
      return "Rp " + numericPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return "Rp 0"; 
    }
  },

  addToCart(item) {
      this.cartItems.push(item);
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      console.log("Updated Cart Items:", this.cartItems);
      setTimeout(() => {
        localStorage.removeItem("cartItems");
      }, 24 * 60 * 60 * 1000); 
    },
  
  removeCartItem(index) {
      this.cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    },

  handleImageChange(event) {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      this.selectedImage = file; 
    }
  },

  async submitCart(event) {
    event.preventDefault();
    try {
      const currentDate = new Date(); 
      const formattedDate = currentDate.toISOString();

      const dataTransaction = {
      id_member: this.userData.id_member,
      purchase_date: formattedDate, 
      total_amount: this.totalSubtotal, 
      image: this.selectedImage,
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.token) {
          console.error("Token not available");
          return;
        }
        
        const headers = {
          Authorization: `Bearer ${userData.token}`
        };

    const responseTransaction = await axios.post("http://localhost:5000/transactions", dataTransaction, 
      {
        headers: {
          ...headers,  // Spread the headers object here
          "Content-Type": "multipart/form-data",
        },
    });

    const newTransactionId = responseTransaction.data.insertedIds[0];
      
    const transactionItems = this.cartItems.map(item => ({
      id_transaction: newTransactionId,
      id_product: item._id,
      qty: item.qty,
      sub_total: item.price * item.qty,
    }));

    await axios.post("http://localhost:5000/transactionitems", transactionItems, {
      headers: {
        ...headers,  // Spread the headers object here
        "Content-Type": "application/json",
      },
    });

    this.cartItems = [];
    window.location.href = "/history";
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  },

  handleQuantityChange(item) {
    if (item.qty < 0) {
      item.qty = 0; 
    }
  },

  },
  
  mounted() {
    this.fetchImages();
    this.intervalId = setInterval(this.nextSlide, 3000);
  },

  created() {
    const userData = this.getUserDataFromLocalStorage();
    if (userData) {
      console.log("Logged in as:", userData.username);
    }
  },

  computed: {
    formattedModalImageName() {
    if (this.selectedModalImage) {
      const originalName = this.selectedModalImage.name;
      return originalName.charAt(0).toUpperCase() + originalName.slice(1);
    }
    return '';
  },

    userData() {
      return this.getUserDataFromLocalStorage();
    },
  totalSubtotal() {
    return this.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  }
},

};
</script>

<style>
.container {
  width: 100%;
}

.container-body {
  padding: 10px;
}

.row {
  padding: 10px;
}

.img-thumbnail {
  width: 300px; /* Set the desired width */
  height: 200px; /* Set the desired height */
  object-fit: cover; /* Maintain aspect ratio and cover the container */
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 5px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Adjust as needed */
  gap: 20px; /* Adjust the gap between products */
}

.product {
  flex-basis: calc(20% - 20px); /* Divide available width by 5 and adjust gap */
  padding: 10px;
  box-sizing: border-box;
}

.blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  /* padding: 20px; */
  max-width: 50%;
  max-height: 80%; /* Adjust the max-height as needed */
  text-align: center;
  position: relative;
  overflow-y: auto; /* Add this to enable scrolling if content exceeds max-height */

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 11 */
}

.modal-content::-webkit-scrollbar {
  width: 0; /* Safari and Chrome */
}

.modal-image {
  max-width: 100%;
  width: auto;
  height: auto;
}

.modal-header {
  background-color: #f0f0f0;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}

.modal-header h3 {
  margin-right: auto; /* Pushes the close button to the right */
}

.close-button {
  font-size: 24px;
  cursor: pointer;
}

</style>
