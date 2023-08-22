<template>
  <div>
    <h1>Product List</h1>
    <span class="btn btn-success" @click="showModal = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-plus-fill" viewBox="0 0 16 16">
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0z"/>
      </svg>
      Tambah Produk
    </span>
    <table ref="productTable" style="width: 100%;" class="table table-striped" align="center">
      <thead class="bg-dark text-light text-center" style="height:50px;">
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Price</th>
          <th>Description</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product, index in products" :key="product._id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.description }}</td>
          <td>
            <img v-if="product.image" :src="getImageUrl(product.image)" alt="Product Image" height="120" />
          </td>
          <td>
            <button class="btn btn-warning mr-2" @click="editProduct(product)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square mb-1" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
              Edit
            </button>
            <button class="btn btn-danger" @click="deleteProduct(product._id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill mb-1" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
  <div v-if="showModal" class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ selectedProduct ? "Edit Product" : "Add New Product" }}</h5>
        <button type="button" class="close" @click="closeModal">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <div class="row">
              <div class="col">
                <h2>{{ selectedProduct ? "Edit Product" : "Add New Product" }}<hr></h2>
                <form @submit.prevent="submitForm" style="margin-top:-20px">
                  <table class="table table-striped">
                    <tr>
                      <td>Name:</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedProduct.name" type="text" id="name" class="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <td>Price:</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedProduct.price" type="number" id="price" class="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <td>Description:</td>
                      <td>:</td>
                      <td>
                        <textarea v-model="editedProduct.description" id="description" class="form-control"></textarea>
                      </td>
                    </tr>
                    <tr>
                      <td>Image:</td>
                      <td>:</td>
                      <td>
                        <input type="file" @change="handleImageChange" id="image" class="form-control" />
                        <img v-if="imagePreview" :src="imagePreview" alt="Image Preview" height="100" />
                      </td>
                    </tr>
                  </table>
                  <button class="btn btn-success" type="submit">
                    {{ selectedProduct ? "Update" : "Add" }} Product
                  </button>
                </form>
              </div>
            </div>
          </div>
      </div>
    </div>
    <!-- End Modal -->
  </div>
</template>

<script>
import axios from "axios";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import "datatables.net";

export default {
  data() {
    return {
      products: [],
      selectedProduct: null,
      editedProduct: {
        name: "",
        price: "",
        description: "",
        image: null,
      },
      imagePreview: null,
      showModal: false,
    };
  },

  mounted() {
    this.fetchProducts();
  },

  watch: {
    products: {
      handler: function () {
        this.$nextTick(() => {
          this.initDataTable();
        });
      },
      deep: true,
    },
  },

  methods: {
     getUserDataFromLocalStorage() {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      return null;
    },
    
    closeModal() {
      this.showModal = false;
      this.clearForm();
    },

    toggleModal() {
      this.showModal = !this.showModal;
      this.clearForm();
    },

    async fetchProducts() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.token) {
          console.error("Token not available");
          return;
        }
        
        const headers = {
          Authorization: `Bearer ${userData.token}`
        };

        const response = await axios.get("http://localhost:5000/products", { headers });
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    initDataTable() {
      if ($.fn.DataTable.isDataTable(this.$refs.productTable)) {
        $(this.$refs.productTable).DataTable().destroy();
      }

      $(this.$refs.productTable).DataTable({
        searching: true,
        ordering: true,
        paging: true,
      });
    },

    async addProduct(newProduct) {
      try {
        const response = await axios.post("http://localhost:5000/products", newProduct);
        this.products.push(response.data);
        this.clearForm();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },

    async deleteProduct(productId) {
      try {
        await axios.delete(`http://localhost:5000/products/${productId}`);
        this.products = this.products.filter((product) => product._id !== productId);
        if (this.selectedProduct && this.selectedProduct._id === productId) {
          this.clearForm();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },

    async editProduct(product) {
      this.showModal = true;
      this.selectedProduct = product;
      this.editedProduct = { ...product };
    },

    async updateProduct(productId, updatedProduct) {
      try {
        const response = await axios.put(`http://localhost:5000/products/${productId}`, updatedProduct);

        this.products = this.products.map((product) =>
          product._id === response.data._id ? response.data : product
        );
        this.selectedProduct = null;
        this.clearForm();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },

   async submitForm() {
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
      console.error("Token not available");
      return;
    }
    
    const headers = {
      Authorization: `Bearer ${userData.token}`
    };

    this.editedProduct.price = parseFloat(this.editedProduct.price);
    this.editedProduct.description = this.editedProduct.description.toString();

    const formData = new FormData();
    formData.append("name", this.editedProduct.name);
    formData.append("price", this.editedProduct.price);
    formData.append("description", this.editedProduct.description);
    formData.append("image", this.editedProduct.image);

    const config = {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    };

    if (this.selectedProduct) {
      const productId = this.selectedProduct._id;
      const response = await axios.put(
        `http://localhost:5000/products/${productId}`,
        formData,
        config
      );
      this.products = this.products.map((product) =>
        product._id === response.data._id ? response.data : product
      );
      this.selectedProduct = null;
      this.showModal = false;
      this.clearForm();
    } else {
      const response = await axios.post(
        "http://localhost:5000/products",
        formData,
        config
      );
      this.products.push(response.data);
      this.showModal = false;
      this.clearForm();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
},


    clearForm() {
      this.editedProduct.name = "";
      this.editedProduct.price = "";
      this.editedProduct.description = "";
      this.editedProduct.image = null;
      this.imagePreview = null;
      this.selectedProduct = null;
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      console.log("Selected file:", file);

      if (file) {
        this.editedProduct.image = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.editedProduct.image = null;
        this.imagePreview = null;
      }
    },

    getImageUrl(imageFilename) {
      return `http://localhost:5000/public/uploads/${imageFilename}`;
    },

     created() {
    const userData = this.getUserDataFromLocalStorage();
    if (userData) {
      console.log("Logged in as:", userData.username);
    }
  },

  },
    computed: {
    userData() {
      return this.getUserDataFromLocalStorage();
    },
  },
};
</script>

<style>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Add a black semi-transparent background */
  z-index: 9999;
}

.modal-dialog {
  display: flex; /* Add this to center the content horizontally */
  flex-direction: column; /* Add this to stack the modal content vertically */
  max-width: 500px; /* Adjust the width of the modal as needed */
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #343a40; /* Change the background color of the header */
  color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.modal-content{
  max-width:35%;
}

.modal-title {
  margin: 0;
  font-size: 20px;
}

.modal-body {
  padding: 20px;
}

.modal-body img {
  display: block;
  margin: 0 auto;
}

.close {
  font-size: 24px;
  font-weight: bold;
}

form {
  margin-top: 20px;
  flex: 1; /* Add this to make the form take the available vertical space */
  display: flex; /* Add this to stack the form elements vertically */
  flex-direction: column; /* Add this to stack the form elements vertically */
  justify-content: space-between; /* Add this to distribute elements evenly */
}
form .form-control {
  margin-bottom: 10px;
}

.btn {
  cursor: pointer;
}

.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-warning {
  background-color: #ffc107;
  color: #fff;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-danger:hover {
  background-color: #c82333;
}

.table {
  margin-top: 20px;
}

.table th,
.table td {
  vertical-align: middle;
}

.table thead th {
  background-color: #343a40;
  color: #fff;
}

.container {
  padding: 20px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 90%;
  }
}
</style>
