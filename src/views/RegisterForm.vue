<template>
    <div class="row">
        <div class="col-5 mx-auto">
  <form @submit.prevent="submitForm">
    <h3 style="margin-top:-30px">Registrasi Form</h3>
    Please fill correct data for safe transaction
    <hr>
    <table class="table table-striped" style="margin-top:-5px">
      <tr>
        <td>Fullname</td>
        <td>:</td>
        <td>
          <input v-model="editedmember.name" type="text" id="name" class="form-control" />
        </td>
      </tr>
      <tr>
  <td>Gender</td>
  <td>:</td>
  <td>
      <input v-model="editedmember.gender" type="radio" value="male" /> Male
      <input v-model="editedmember.gender" type="radio" value="female" style="margin-left:20px; margin-bottom: 10px;" /> Female
  </td>
</tr>
      <tr>
        <td>Phone:</td>
        <td>:</td>
        <td>
          <input v-model="editedmember.phone" id="phone" class="form-control" />
        </td>
      </tr>
      <tr>
        <td>Email:</td>
        <td>:</td>
        <td>
          <input v-model="editedmember.email" id="email" class="form-control" required type="email" />
        </td>
      </tr>
      <tr>
        <td>Username:</td>
        <td>:</td>
        <td>
          <input v-model="editedmember.username" id="username" class="form-control" />
        </td>
      </tr>
      <tr>
        <td>Password:</td>
        <td>:</td>
        <td>
          <input v-model="editedmember.password" id="password" class="form-control" />
        </td>
      </tr>
    </table>

 <!-- CAPTCHA -->
    <div class="form-group">
      <label for="captcha">CAPTCHA: What is {{ captchaNumber1 }} + {{ captchaNumber2 }} ?</label>
      <input v-model="captchaInput" type="number" id="captcha" class="form-control" />
      <p v-if="showCaptchaErrorMessage" class="alert alert-danger mt-2">
        Incorrect CAPTCHA. Please try again.
      </p>
    </div>

    <button class="btn btn-success" type="submit">
      {{ selectedmember ? "Update" : "Add" }} Member
    </button>
  </form>
   <div v-if="showSuccessMessage" class="alert alert-success mt-3" role="alert">
          Member added successfully. You can now <a href="/login">login</a>.
        </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
         captchaNumber1: 0,
      captchaNumber2: 0,
      captchaInput: '',
      isCaptchaValid: false,
      showCaptchaErrorMessage: false,

        editedmember: {
            name: '',
            gender: '',
            phone: '',
            email: '',
            username: '',
            password: '',
            is_staff: false
        },
        selectedmember: null,
        showSuccessMessage: false  // Initialize the success message state

    };
},
       created() {
    this.generateRandomNumbers();
  },
    methods: {
       generateRandomNumbers() {
      this.captchaNumber1 = Math.floor(Math.random() * 10);
      this.captchaNumber2 = Math.floor(Math.random() * 10);
    },

    async submitForm() {
        try {

          // Verify CAPTCHA
        const correctAnswer = this.captchaNumber1 + this.captchaNumber2;
        if (parseInt(this.captchaInput) === correctAnswer) {
          this.isCaptchaValid = true;
          this.showCaptchaErrorMessage = false;
           const requestData = {
                name: this.editedmember.name,
                gender: this.editedmember.gender,
                phone: this.editedmember.phone,
                email: this.editedmember.email,
                username: this.editedmember.username,
                password: this.editedmember.password,
                is_staff: this.editedmember.is_staff
            };

            await axios.post(
            "http://localhost:5000/members",
            requestData
            );

            this.clearForm();
            this.showSuccessMessage = true;
            setTimeout(() => {
            window.location.href = "/login";
            }, 7000); 

          // ... Your existing submitForm logic ...
        } else {
           this.isCaptchaValid = false;
          this.showCaptchaErrorMessage = true;
        }


            
        } catch (error) {
        console.error("Error submitting member:", error);
        }
    },
    clearForm() {
        this.editedmember = {
            name: '',
            gender: '',
            phone: '',
            email: '',
            username: '',
            password: '',
            is_staff: false
        };
        },
    }
};
</script>

<style>
.alert-captcha-error {
  margin-top: 5px;
  color: red;
}
</style>