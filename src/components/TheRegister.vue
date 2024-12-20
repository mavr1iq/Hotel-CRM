<template>
  <head>
    <meta charset="UTF-8">
    <title>Сторінка реєстрації</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
  <main>
    <form
        id="app"
        ref="form"
        method="post"
        @submit="submitForm"
        class="registration-form"
        name="regForm">
      <label>
        Пошта:
        <input
            id="email"
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
      <label>
        Прізвище:
        <input
            id="surname"
            v-model="surname"
            type="text"
            name="surname"
            @input="validateSurname"
        >
      </label>
      <p v-if="errors.surnameError">{{errors.surnameError}}</p>
      <label>
        Ім'я
        <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            @input="validateName"
        >
      </label>
      <p v-if="errors.nameError">{{errors.nameError}}</p>
      <label>
        По батькові:
        <input
            id="patronymic"
            v-model="patronymic"
            type="text"
            name="patronymic"
            @input="validatePatronymic"
        >
      </label>
      <p v-if="errors.patronymicError">{{errors.patronymicError}}</p>
      <label>
        Номер телефону:
        <input
            id="phone"
            v-model="phone"
            type="text"
            name="phone"
            @input="validateNumber"
        />
      </label>
      <p v-if="errors.phoneError">{{errors.phoneError}}</p>
      <label>
        Дата народження:
        <input
            id="date"
            v-model="date"
            type="date"
            name="date"
            @focusout="validateDate"
            @keyup="validateDate"
            @change ="validateDate"
        >
      </label>
      <p v-if="errors.dateError">{{errors.dateError}}</p>
      <br>
      <label>
        Тип:
      </label>
      <br>
      <select
          id="types"
          v-model="types"
          name="types"
          @focusout="validateTypes"
          @change="validateTypes"
      >
        <option value="Дешевий">Дешевий</option>
        <option value="Середній">Середній</option>
        <option value="Дорогий">Дорогий</option>
        <option value="Люкс">Люкс</option>
      </select>
      <p v-if="errors.typeError">{{errors.typeError}}</p>
      <fieldset>
        <legend>Стать:</legend>
        <label>Чоловік
          <input
              id="sex"
              v-model="sex"
              type="radio"
              name="sex"
              value="male"
              @change="validateSex"
          >
        </label>
        <br>
        <label>Жінка
          <input id="sex"
                 v-model="sex"
                 type="radio"
                 name="sex"
                 value="female"
                 @change="validateSex"
          >
        </label>
        <p v-if="errors.sexError">{{errors.sexError}}</p>
      </fieldset>
      <br>
      <label>
        Фото профілю:
        <label class="file">
          Завантажити
          <input type="file" accept="*/png, */jpg, */jpeg">
        </label>
      </label>
      <input type="submit" value="Зареєструватися"/>
      <p v-if="errors.regError">{{errors.regError}}</p>
    </form>
  </main>
  </body>
</template>

<script>
import {defineComponent} from "vue";
import '../styles/TheRegister.css'
import axios from "@/axios";

export default defineComponent({
  data() {
    return {
      // Input values
      email: null,
      pass: null,
      surname: null,
      name: null,
      patronymic: null,
      phone: '+38',
      date: null,
      types: null,
      sex: null,

      // Errors
      errors: {},

    }
  },

  methods: {
    async submitForm(e) {
      e.preventDefault();

      // Validating email
      this.validateEmail()

      // Validating password
      this.validatePass()

      // Validating surname
      this.validateSurname()

      // Validating name
      this.validateName()

      // Validating patronymic
      this.validatePatronymic()

      // Validating phone number
      this.validateNumber()

      // Validating dates
      this.validateDate()

      // Validating types
      this.validateTypes()

      // Validating sex
      this.validateSex()

      if (!this.errors["emailError"] && !this.errors["passError"] && !this.errors["nameError"]) {
        const req = {
          name: this.name,
          email: this.email,
          pass: this.pass
        }
        try {
          const user = await axios.post('api/register', req)
          console.log(user)
          if (user) {
            delete this.errors["regError"]
            this.$router.push('/')
          }
        } catch (error) {
          this.errors["regError"] = "User already exists"
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

    validateSurname() {
      if (this.surname) {
        if (!this.validateTextOnly(this.surname)) {
          this.errors["surnameError"] = "Surname should be in range of 2-40 characters and cannot contain any digits"
        } else {
          delete this.errors["surnameError"]
        }
      } else {
        this.errors["surnameError"] = "Enter your surname"
      }
    },

    validateName() {
      if (this.name) {
        if (!this.validateTextOnly(this.name)) {
          this.errors["nameError"] = "Name should be in range of 2-40 characters and cannot contain any digits"
        } else {
          delete this.errors["nameError"]
        }
      } else {
        this.errors["nameError"] = "Enter your name"
      }
    },

    validatePatronymic() {
      if (this.patronymic) {
        if (!this.validateTextOnly(this.patronymic)) {
          this.errors["patronymicError"] = "Patronymic should be in range of 2-40 characters and cannot contain any digits"
        } else {
          delete this.errors["patronymicError"]
        }
      } else {
        this.errors["patronymicError"] = "Enter your patronymic"
      }
    },

    validateNumber() {
      if (this.phone.length < 16) {
        this.errors["phoneError"] = "Enter your phone number"
      } else {
        delete this.errors["phoneError"]
      }
      if (this.phone.length < 3) {
        this.phone = "+38"
      }
      let x = this.phone.replace(/[^\d+]/g, '').match(/(\+?)(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      this.phone = !x[4] ? x[1]+x[2]+x[3] : x[1]+x[2] + '(' + x[3] + ')' + x[4] + (x[5] ? '-' + x[5] : '') + (x[6] ? '-' + x[6] : '');
    },

    validateDate() {
      let today = new Date()
      if (this.date) {
        let year = parseInt(this.date.split('-')[0])
        let month = parseInt(this.date.split('-')[1])
        let day = parseInt(this.date.split('-')[2])
        if (year < 1900 || year > 2024) {
          this.errors["dateError"] = "Year should be valid"
        } else if (month > today.getMonth()+1) {
          this.errors["dateError"] = "Month should be valid"
        }else if (month === today.getMonth()+1 && day > today.getDate()) {
          this.errors["dateError"] = "Day should be valid"
        } else {
          delete this.errors["dateError"]
        }
      } else {
        this.errors["dateError"] = "Enter your birth date"
      }
    },

    validateTypes() {
      if (!this.types) {
        this.errors["typeError"] = "Choose type"
      } else {
        delete this.errors["typeError"]
      }
    },

    validateSex() {
      if (!this.sex) {
        this.errors["sexError"] = "Choose sex"
      } else {
        delete this.errors["sexError"]
      }
    },

    // Validating for text
    validateTextOnly(name) {
      return name.match(/[A-Za-z]{2,40}/g) ? name.match(/[A-Za-z]{2,40}/g).length === 1 : name.match(/[A-Za-z]{2,40}/g)
    }
  }
})

</script>