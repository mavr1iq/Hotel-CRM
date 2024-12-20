<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <h2>{{ isEditing === "Редагувати" ? "Редагувати" : "Створити" }} {{ entityType }}</h2>
      <div>
      </div>
      <div v-if="entityType === 'Кімната'">
        <label>
          Назва:
          <br>
          <input v-model="form.name" type="text" required @input="validateName"/>
        </label>
        <p v-if="errors.nameError">{{errors.nameError}}</p>
        <label>
          Опис:
          <br>
          <textarea v-model="form.description" required @input="validateDescription"></textarea>
        </label>
        <p v-if="errors.descriptionError">{{errors.descriptionError}}</p>
        <label>
          <br>
          Локація:
          <select v-model="selected" required>
            <option v-for="address in addresses" v-bind:key="address.id">
              {{address.id}}  {{address.address}}
            </option>
          </select>
        </label>
      </div>
      <div v-if="entityType === 'Локація'">
        <label>
          Адреса:
          <input v-model="form.address" type="text" required @input="validateAddress"/>
        </label>
        <p v-if="errors.addressError">{{errors.addressError}}</p>
      </div>
      <button type="submit">{{ isEditing ? "Зберегти" : "Створити" }}</button>
      <p v-if="errors.roomError">{{errors.roomError}}</p>
      <p v-if="errors.locationError">{{errors.locationError}}</p>
      <p class="success" v-if="success.roomSuccess">{{success.roomSuccess}}</p>
      <p class="success" v-if="success.locationSuccess">{{success.locationSuccess}}</p>
    </form>
  </main>
</template>

<script>
import '../styles/TheEditCreate.css'
import axios from '../axios'


export default {
  name: 'TheEditCreate',
  watch: {
    '$route.query': {
      immediate: true,
      handler(newVal) {
        this.isEditing = newVal.isEditing
        this.entityType = newVal.entityType
        this.id = newVal.id
        this.address = newVal.address
      }
    }
  },
  async mounted() {
    this.isEditing = this.$route.query.isEditing
    this.entityType = this.$route.query.entityType
    this.id = this.$route.query.id
    this.address = this.$route.query.address
    delete this.success["roomSuccess"]
    delete this.success["locationSuccess"]

    const locations = await axios.get('api/locations/')

    for (let location of locations.data) {
      this.addresses.push(location)
    }
  },
  data() {
    return {
      isEditing: '',
      entityType: '',
      id: null,
      address: '',
      selected: '',
      addresses: [],
      form: {
        name: '',
        description: '',
        locationId: null,
        address: ''
      },
      errors: {},
      success: {}
    }
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault()
      delete this.success["roomSuccess"]
      delete this.success["locationSuccess"]

      if (this.entityType === 'Кімната') {
        this.validateName()
        this.validateDescription()
        const location_id = this.selected.split(' ')[0]

        const data = {
          name: this.form.name,
          description: this.form.description,
          location_id: parseInt(location_id)
        }
        // Логіка для створення
        if (this.isEditing === 'Створити') {
          try {
            if (Object.values(this.errors).length === 0) {
              const response = await axios.post('api/rooms', data)

              if (response) {
                delete this.errors["roomError"]
                this.success["roomSuccess"] = "Room created"
              }
            } else {
              this.errors["roomError"] = "Problem with creating a room"
            }

          } catch (error) {
            console.log(error.toString())
            this.errors["roomError"] = "Problem with creating a room"
          }

          if (this.errors["roomError"] !== "Problem with creating a room") {
            this.success["roomSuccess"] = "Room created"
            this.form.name = ''
            this.form.description = ''
            this.form.locationId = null
          }
        }

        // Логіка для редагування
        if (this.isEditing === 'Редагувати') {
          try{
            if (Object.values(this.errors).length === 0) {
              const response = await axios.put(`api/rooms/${this.id}`, data)

              if (response) {
                delete this.errors["roomError"]
                delete this.errors["idError"]
                this.success["roomSuccess"] = "Room updated"
              }
            } else {
              this.errors["roomError"] = "Problem with updating a room"
            }
          } catch (error) {
            console.log(error.toString())
            this.errors["roomError"] = "Problem with updating a room"
          }

          if (this.errors["roomError"] !== "Problem with updating a room") {
            this.success["roomSuccess"] = "Room updated"
            this.form.name = ''
            this.form.description = ''
            this.selected = null
          }
        }

      // Локації
      } else if (this.entityType === 'Локація') {
          this.validateAddress()

          const data = {
            address: this.form.address
          }

        if (this.isEditing === 'Створити') {
          try {
            if (Object.values(this.errors).length === 0) {
              const response = await axios.post('api/locations', data)

              if (response) {
                delete this.errors["locationError"]
                this.success["locationSuccess"] = "Location created"
              }
            } else {
              this.errors["locationError"] = "Problem with creating a location"
            }
          } catch (error) {
            this.errors["locationError"] = "Problem with creating a location"
          }
          if (this.errors["locationError"] !== "Problem with creating a location") {
            this.success["locationSuccess"] = "Location created"
            this.form.address = ''
          }
        }
        // Логіка для редагування
        if (this.isEditing === 'Редагувати') {
          try{
            const { id } = (await axios.post(`api/locations/${this.address}`)).data

            if (!id) {
              this.errors["locationError"] = "Problem with updating a location"
            }
            if (Object.values(this.errors).length === 0) {
              const response = await axios.put(`api/locations/${id}`, data)

              if (response) {
                delete this.errors["locationError"]
                this.success["locationSuccess"] = "Location updated"
              }
            } else {
              console.log(this.errors)
              this.errors["locationError"] = "Problem with updating a location"
            }
          } catch (error) {
            this.errors["locationError"] = "Problem with updating a location"
          }

          if (this.errors["locationError"] !== "Problem with updating a location") {
            this.success["locationSuccess"] = "Location updated"
            this.address = this.form.address
            this.form.address = ''
          }
        }
      }
    },
    validateTextOnly(name) {
      return name.match(/[A-Za-z ]{2,40}/g) ? name.match(/[A-Za-z ]{2,40}/g).length === 1 : name.match(/[A-Za-z ]{2,100}/g)
    },
    validateTextAndDigits(name) {
      return name.match(/[A-Za-z0-9 ]{2,40}/g) ? name.match(/[A-Za-z ]{2,40}/g).length === 1 : name.match(/[A-Za-z ]{2,100}/g)
    },

    validateName() {
      if (this.form.name) {
        if (!this.validateTextOnly(this.form.name)) {
          this.errors["nameError"] = "Name should be in range of 2-100 characters and cannot contain any digits"
        } else {
          delete this.errors["roomError"]
          delete this.errors["locationError"]
          delete this.errors["nameError"]
        }
      } else {
        this.errors["nameError"] = "Enter your name"
      }
    },

    validateDescription() {
      if (this.form.description) {
        if (!this.validateTextOnly(this.form.description)) {
          this.errors["descriptionError"] = "Description should be in range of 2-100 characters and cannot contain any digits"
        } else {
          delete this.errors["roomError"]
          delete this.errors["locationError"]
          delete this.errors["descriptionError"]
        }
      } else {
        this.errors["descriptionError"] = "Enter your description"
      }
    },
    validateAddress() {
      if (this.form.address) {
        if (!this.validateTextAndDigits(this.form.address)) {
          this.errors["addressError"] = "Location should be in range of 2-100 characters"
        } else {
          delete this.errors["roomError"]
          delete this.errors["locationError"]
          delete this.errors["addressError"]
        }
      } else {
        this.errors["addressError"] = "Enter your location"
      }
    }
  }
}
</script>