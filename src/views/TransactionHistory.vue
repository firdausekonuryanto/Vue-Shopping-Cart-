<template>
  <div class="container" style="margin-top:-20px; background-color:rgb(247, 247, 230)">
    <h2>Transaction History</h2>
    <canvas ref="barChart"></canvas>

    <div class="row mb-3">
  <div class="col">
    <label for="start-date">Start Date:</label>
    <input type="date" id="start-date" v-model="startDate" @input="updateStartDate" style="width:20%" />
    <label for="end-date">End Date:</label>
    <input type="date" id="end-date" v-model="endDate" @input="updateEndDate" style="width:20%" />
    <button class="btn btn-primary" style="margin-left:5px" @click="fetchTransactions">Search</button>
  </div>
</div>

    <table class="table table-striped" style="margin-top:-20px">
      <thead class="text-center">
        <tr>
          <th>NO</th>
          <th>Name Customer</th>
          <th>Member ID</th>
          <th>Purchase Date</th>
          <th>Total Amount</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction, index) in transactions" :key="index">
          <td class="text-center">{{ index+1 }}</td>
          <td>{{ transaction.memberName }}</td>
          <td class="text-center">{{ transaction.id_member }}</td>
          <td class="text-center">{{ formatDate(transaction.purchase_date) }}</td>
          <td class="text-center">{{ formatPrice(transaction.total_amount) }}</td>
          <td class="text-center">
            <button  @click="openModal(transaction)" class="btn btn-warning btn-sm" style="color: black; margin-right:5px">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M7.998.5a8.978 8.978 0 0 0-7.577 4.062A8.978 8.978 0 0 0 .5 7.998a8.978 8.978 0 0 0 4.062 7.577A8.978 8.978 0 0 0 7.998 15a8.978 8.978 0 0 0 7.577-4.062A8.978 8.978 0 0 0 15.5 7.998a8.978 8.978 0 0 0-4.062-7.577A8.978 8.978 0 0 0 7.998.5zm0 13a4.979 4.979 0 0 1-4.166-2.33c.93-1.282 2.346-2.167 4.166-2.167a4.979 4.979 0 0 1 4.166 2.33c-.93 1.282-2.346 2.167-4.166 2.167zm0-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              </svg>
              receipt
            </button>
              <button  @click="openModalPrint(transaction)" class="btn btn-success btn-sm" style="color: black;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5V3h-2v-.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5V3H1v-.5zm0 5V6h14v1H1zM1 9V8h14v1H1zm0 3V11h14v1H1zm1 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H2zm0 2a.5.5 0 0 0-.5.5v.5h15v-.5a.5.5 0 0 0-.5-.5H1z"/>
            </svg>
              Struct
            </button>
          </td>
        </tr>
      <tr class="text-center">
        <td colspan="4"><b>TOTAL</b></td>
        <td><b>{{ getTotalAmount() }}</b></td>
        <td style="background-color:grey"></td>
      </tr>
      </tbody>
    </table>

            <div v-if="showModal" class="modal">
              <div class="modal-content">
                <div class="modal-header">
            <h5 class="modal-title">Receipt Transaction</h5>
            <button type="button" class="close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <img v-if="transaction" :src="'http://localhost:5000/public/transactions/' + transaction.image" :alt="transaction.image" class="img-thumbnail" />
              </div>
            </div>
          </div>
      </div>
    </div>

            <div v-if="showModalPrint" class="modal">
    <div class="modal-content modal-print">
      <div class="modal-header">
            <h5 class="modal-title">Transaction Items</h5>
            <button type="button" class="close" @click="closeModalPrint">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h3><b>TOKO SUNRATU</b></h3>
            <p>Stand Dalam Pasar Block H7-H10 Telp. 0853 3832 1400</p>
            <hr>
            <table class="table" style="width:60%">
              <tr>
                <td>Transaction ID</td>
                <td>:</td>
                <td>{{ selectedTransactionItems.length > 0 ? selectedTransactionItems[0].id_transaction : 'N/A' }}</td>
              </tr>
              <tr>
                <td>Name Customer</td>
                <td>:</td>
                <td>{{ transaction ? transaction.memberName : 'N/A' }}</td>
              </tr>
              <tr>
                <td>Date Purchase</td>
                <td>:</td>
                <td>{{ transaction ? formatDate(transaction.purchase_date) : 'N/A' }}</td>
              </tr>
              <tr>
                <td>Total Amount</td>
                <td>:</td>
                <td>{{ transaction ? formatPrice(transaction.total_amount) : 'N/A' }}</td>
              </tr>
            </table>
            <hr>
            <table class="table table-striped">
              <thead class="text-center">
                <tr>
                  <th>No</th>
                  <th>ID Trans</th>
                  <th>ID Product</th>
                  <th>Qty</th>
                  <th>Sub Total</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center" v-for="(transactionitem, index) in selectedTransactionItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ transactionitem.id_transaction }}</td>
                  <td>{{ transactionitem.product ? transactionitem.product.name : 'N/A' }}</td> <!-- Display product name if available, otherwise 'N/A' -->
                  <td>{{ transactionitem.qty }}</td>
                  <td>{{ formatPrice(transactionitem.sub_total) }}</td>
                </tr>
              </tbody>
            </table>
            <p>Terimakasih atas pembelian anda !!!, Smoga datang kembali 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
            <circle cx="256" cy="256" r="240" fill="#FFC107" />
            <circle cx="192" cy="192" r="48" fill="#333" />
            <circle cx="320" cy="192" r="48" fill="#333" />
            <path d="M192 320h128c-64 0-64 96-128 96s-64-96-128-96z" fill="#333" />
            </svg>
            </p>
            <button class="btn btn-warning btn-sm">Print Receipt</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from 'chart.js/auto'; // Importing Chart.js with the "auto" build

export default {
  data() {
    return {
      transactions: [],
      transactionitems: [],
      members: [], 
      showModal: false,
      showModalPrint: false,
      startDate: null,
      endDate: null,
      parsedStartDate: null,
      parsedEndDate: null,
    };
  },
  
  methods: {
    extractChartData() {
    const dates_income = this.transactions.map(transaction => transaction.purchase_date);
    const amount_income = this.transactions.map(transaction => parseFloat(transaction.total_amount));
    return { dates_income, amount_income };
  },

  
    renderBarChart() {
      const { dates_income, amount_income } = this.extractChartData();
    const ctx = this.$refs.barChart.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates_income, // Replace with your labels
        datasets: [{
          label: 'Dataset Label',
          data: amount_income, // Replace with your data values
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },
    updateStartDate(event) {
      this.parsedStartDate = new Date(event.target.value);
    },
    updateEndDate(event) {
      this.parsedEndDate = new Date(event.target.value);
    },

    getTotalAmount() {
      const totalAmount = this.transactions.reduce((total, transaction) => {
        return total + parseFloat(transaction.total_amount);
      }, 0);

      return this.formatPrice(totalAmount);
    },

    filterByDateRange(transaction) {
      if (!this.startDate || !this.endDate) {
        return true;
      }

      const purchaseDate = new Date(transaction.purchase_date);
      return purchaseDate >= this.startDate && purchaseDate <= this.endDate;
    },

    getUserDataFromLocalStorage() {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      return null;
    },

    openModal(transaction) {
        this.transaction = transaction;
        this.showModal = true;
      },

    closeModal() {
      this.showModal = false;
    },

    openModalPrint(transaction) {
      this.transaction = transaction; // Assign the transaction object
      this.selectedTransactionItems = this.transactionitems.filter(item => item.id_transaction === transaction._id);
      this.showModalPrint = true;
    },

    closeModalPrint() {
      this.showModalPrint = false;
      this.selectedTransactionItems = []; // Clear selected transaction items
    },

    toggleModal() {
      this.showModal = !this.showModal;
    },

    async fetchTransactions() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.token) {
          console.error("Token not available");
          return;
        }

        const headers = {
          Authorization: `Bearer ${userData.token}`
        };

        let apiUrl = "http://localhost:5000/transactions";

        if (this.startDate && this.endDate) {
          const isoStartDate = this.parsedStartDate.toISOString();
          const isoEndDate = this.parsedEndDate.toISOString();
          apiUrl += `?startDate=${isoStartDate}&endDate=${isoEndDate}&is_staff=${userData.is_staff}&id_member=${userData.id_member}`;
        } else {
          apiUrl += `?is_staff=${userData.is_staff}&id_member=${userData.id_member}`;
        }

        const responseTransactions = await axios.get(apiUrl, { headers });

        // console.log(responseTransactions);
        const filteredTransactions = responseTransactions.data
          .map(transaction => ({
            ...transaction,
            memberName: this.members.find(member => member._id === transaction.id_member)?.name || "Unknown"
          }));

        this.transactions = filteredTransactions;
        this.renderBarChart();
        // console.log("Filtered Transactions:", this.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
},

async fetchTransactionitems() {
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
      console.error("Token not available");
      return;
    }
    
    const headers = {
      Authorization: `Bearer ${userData.token}`
    };

    const response = await axios.get("http://localhost:5000/transactionitems", { headers });
    // console.log("Transaction Items Response:", response.data);

    this.transactionitems = await Promise.all(response.data.map(async transactionItem => {
      try {
        const productResponse = await axios.get(`http://localhost:5000/products/${transactionItem.id_product}`, { headers });
        const product = productResponse.data;
        return {
          ...transactionItem,
          product
        };
      } catch (error) {
        console.error("Error fetching product:", error);
        return transactionItem; 
      }
      }));
    } catch (error) {
    console.error("Error fetching transaction items:", error);
  }
},

async fetchMembers() {
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.token) {
      console.error("Token not available");
      return;
    }

    const headers = {
    Authorization: `Bearer ${userData.token}`
    };

    const responseMembers = await axios.get("http://localhost:5000/members", { headers });
    this.members = responseMembers.data;
    // this.renderBarChart();
    } catch (error) {
        console.error("Error fetching members:", error);
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
      
formatDate(date) {
  return new Date(date).toLocaleString();
},
},
    
mounted() {
  
  this.fetchMembers();
  this.fetchTransactions();
  this.fetchTransactionitems();
  // this.renderBarChart();
},

created() {
  const userData = this.getUserDataFromLocalStorage();
  if (userData) {
    // console.log("Logged in as:", userData.username);
  }
},

computed: {
  userData() {
    return this.getUserDataFromLocalStorage();
  },
},
};
</script>

<style>
.custom-modal-dialog {
  width: auto;
  max-width: 50%; /* Set the desired maximum width if needed */
}

input[type="date"] {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.modal-print{
  max-width: 40%;
}
canvas {
    max-width: 100%;
  }
</style>