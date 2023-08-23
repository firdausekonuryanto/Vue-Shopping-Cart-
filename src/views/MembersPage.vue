<template>
<div ref="contentToPrint">
    <h1>Members List</h1> 
    <span class="btn btn-success" @click="showModal = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-plus-fill" viewBox="0 0 16 16">
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0z"/>
      </svg>
      Tambah Member
    </span>
    <button class="btn btn-dark" @click="generatePDF" style="margin-left: 5px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
        <path d="M8 12a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-1 0v9.5a.5.5 0 0 0 .5.5zM4.854 8.646a.5.5 0 0 0 .353.854H7v4.793a.5.5 0 0 0 1 0V9.5a.5.5 0 0 0-1 0v3.646H5.146a.5.5 0 0 0-.353.854l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8 12.293 5.854 10.146a.5.5 0 0 0-.708.708l3 3zM1 15.5A1.5 1.5 0 0 0 2.5 17h11a1.5 1.5 0 0 0 1.5-1.5V7a.5.5 0 0 0-1 0v8.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V7a.5.5 0 0 0-1 0v8.5z"/>
      </svg>
      Download Member List to PDF
    </button>
        <table ref="memberTable" style="width: 100%;" class="table table-striped" align="center">
      <thead class="bg-dark text-light text-center" style="height:50px;">
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Username</th>
          <th>Is_staff</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member, index in members" :key="member._id">
          <td>{{ index + 1 }}</td>
          <td>{{ member.name }}</td>
          <td>{{ member.gender }}</td>
          <td>{{ member.phone }}</td>
          <td>{{ member.email }}</td>
          <td>{{ member.username }}</td>
          <td>{{ member.is_staff }}</td>
          <td>
            <button class="btn btn-warning mr-2" @click="editmember(member)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square mb-1" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
              Edit
            </button>
            <button class="btn btn-danger" @click="deletemember(member._id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill mb-1" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

            <div v-if="showModal" class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
            
            <h5 class="modal-title">{{ selectedmember ? "Edit member" : "Add New member" }}</h5>
            <button type="button" class="close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <h2>{{ selectedmember ? "Edit member" : "Add New member" }} <hr></h2>
                <form @submit.prevent="submitForm" style="margin-top:-20px">
                  <table class="table table-striped">
                    <tr>
                      <td>Name</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedmember.name" type="text" id="name" class="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <td>Gender</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedmember.gender" type="text" id="gender" class="form-control" />
                      </td>
                    </tr>
                    <tr>
                      <td>phone:</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedmember.phone" id="phone" class="form-control">
                      </td>
                    </tr>
                    <tr>
                      <td>email:</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedmember.email" id="email" class="form-control">
                      </td>
                    </tr>
                    <tr>
                      <td>username:</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedmember.username" id="username" class="form-control">
                      </td>
                    </tr>
                    <tr>
                      <td>password:</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedmember.password" id="password" class="form-control">
                      </td>
                    </tr>
                    <tr>
                      <td>is_staff:</td>
                      <td>:</td>
                      <td>
                        <input v-model="editedmember.is_staff" type="checkbox" id="is_staff" />
                      </td>
                    </tr>
                  </table>
                  <button class="btn btn-success" type="submit">
                    {{ selectedmember ? "Update" : "Add" }} member
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      members: [],
      selectedmember: null,
      editedmember: {
        name: "",
        gender: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        is_staff: false,
      },
      showModal: false,
    };
  },

  mounted() {
    this.fetchmembers();
  },

  watch: {
    members: {
      handler: function () {
        this.$nextTick(() => {
          this.initDataTable();
        });
      },
      deep: true,
    },
  },

  methods: {
    async generatePDF() {
  const pdf = new jsPDF({
    orientation: 'portrait', // or 'landscape'
    unit: 'mm',
    format: 'a4', // or an array of [width, height]
    marginLeft: 25, // Left margin in mm
    marginRight: 25, // Right margin in mm
    marginTop: 30, // Top margin in mm
    marginBottom: 30, // Bottom margin in mm
  });

  const contentToPrint = this.$refs.contentToPrint;

  const canvas = await html2canvas(contentToPrint);
  const imgData = canvas.toDataURL('image/png');

  const imgWidth = pdf.internal.pageSize.getWidth() - 50; // Adjust for left and right margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let remainingHeight = imgHeight;

  let positionY = 30; // Top margin

  pdf.addImage(imgData, 'PNG', 25, positionY, imgWidth, imgHeight);

  while (remainingHeight > 0) {
    positionY += pdf.internal.pageSize.getHeight();
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 25, positionY, imgWidth, imgHeight);
    remainingHeight -= pdf.internal.pageSize.getHeight();
  }

  pdf.save('member-list.pdf');
},

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

    async fetchmembers() {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.token) {
          console.error("Token not available");
          return;
        }
        
        const headers = {
          Authorization: `Bearer ${userData.token}`
        };

        const response = await axios.get("http://localhost:5000/members",{ headers });
        this.members = response.data;
        this.initDataTable();
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    },

  initDataTable() {
    if ($.fn.DataTable.isDataTable(this.$refs.memberTable)) {
      $(this.$refs.memberTable).DataTable().destroy();
    }

    this.$nextTick(() => {
      $(this.$refs.memberTable).DataTable({
        searching: true,
        ordering: true,
        paging: true,
      });
    });
  },

    async deletemember(memberId) {
      try {
              const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.token) {
          console.error("Token not available");
          return;
        }
        
        const headers = {
          Authorization: `Bearer ${userData.token}`
        };
        await axios.delete(`http://localhost:5000/members/${memberId}`, { headers });
        await this.fetchmembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    },

    async editmember(member) {
      this.showModal = true;
      this.selectedmember = member;
      this.editedmember = { ...member };
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

    const requestData = {
      name: this.editedmember.name,
      gender: this.editedmember.gender,
      phone: this.editedmember.phone,
      email: this.editedmember.email,
      username: this.editedmember.username,
      password: this.editedmember.password,
      is_staff: this.editedmember.is_staff,
    };

    if (this.selectedmember) {
      const memberId = this.selectedmember._id;
      const response = await axios.put(
        `http://localhost:5000/members/${memberId}`,
        requestData, { headers }
      );

      this.members = this.members.map((member) =>
        member._id === response.data._id ? response.data : member
      );
    } else {
      await axios.post(
        "http://localhost:5000/members",
        requestData, { headers }
      );

      // this.members.push(response.data);
    }
    this.clearForm();
    this.showModal = false;
    await this.fetchmembers();
  } catch (error) {
    console.error("Error submitting form:", error);
  }
},

    clearForm() {
      this.editedmember.name = "";
      this.editedmember.gender = "";
      this.editedmember.phone = "";
      this.editedmember.email = "";
      this.editedmember.username = "";
      this.editedmember.password = "";
      this.editedmember.is_staff = false; 
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      console.log("Selected file:", file);

      if (file) {
        this.editedmember.image = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.editedmember.image = null;
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

  computed: {
    userData() {
      return this.getUserDataFromLocalStorage();
    },
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
