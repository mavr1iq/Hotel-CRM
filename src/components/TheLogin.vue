<template>
  <main>
    <form method="post" class="login-form" @submit="submitForm">
      <label>
        Пошта:
        <input
            id="app"
            ref="form"
            v-model="email"
            type="text"
            name="email"
            @input="validateEmail"
        >
      </label>
      <p v-if="errors.emailError">{{errors.emailError}}</p>
      <label>
        Пароль:
        <input
            id="pass"
            v-model="pass"
            type="password"
            name="pass"
            @input="validatePass"
        >
      </label>
      <p v-if="errors.passError">{{errors.passError}}</p>
      <input type="submit" value="Увійти">
      <p v-if="errors.logError">{{errors.logError}}</p>
    </form>
  </main>
</template>

<script>
import '../styles/TheLogin.css'
import axios from "../axios";

export default {
  name: 'TheLogin',
  data() {
    return {
      email: null,
      pass: null,

      errors: {}
    }
  },
  methods: {
    async submitForm(e) {
      e.preventDefault();

      // Validating email
      this.validateEmail()

      // Validating password
      this.validatePass()

      if (!this.errors["emailError"] && !this.errors["passError"]) {
        const req = {
          email: this.email,
          pass: this.pass
        }
        try {
          const user = await axios.post('api/login', req)
          console.log(user)
          if (user) {
            delete this.errors["logError"]
            this.$router.push('/')
          }
        } catch (error) {
          this.errors["logError"] = "Password or login is incorrect"
          console.log(error.toString())
        }
      }
    },
    validateEmail() {
      if (this.email) {
        if (!this.email.match(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
          this.errors["emailError"] = "Not an email"
        } else {
          delete this.errors["emailError"]
        }
      } else {
        this.errors["emailError"] = "Enter your email"
      }
    },

    validatePass() {
      if (this.pass) {
        if (this.pass.length < 6 || this.pass.length > 20) {
          this.errors["passError"] = "Password should be in range of 6-20 characters"
        } else {
          delete this.errors["passError"]
        }
      } else {
        this.errors["passError"] = "Enter your password"
      }
    },
  }
}
</script>