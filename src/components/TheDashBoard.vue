<template>
  <main>
    <table class="dashboard">
      <thead>
      <tr>
        <td class="number">
          №
        </td>
        <td class="hotel-name">
          Назва
        </td>
        <td class="hotel-description">
          Опис
        </td>
        <td class="hotel-description">
          Локація
        </td>
        <td class="actions">
          Дії
        </td>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(room, index) in rooms" :key="index">
          <td>{{room.id}}</td>
          <td>{{room.name}}</td>
          <td>{{room.description}}</td>
          <td>{{room.address}}
            <router-link :to="{ name: 'TheEditCreate', query: {isEditing: this.isEditing, entityType: this.isLocation, address: room.address} }" v-if="$props.isAdmin">
            <FontAwesomeIcon :icon="faPenToSquare" />
          </router-link></td>
          <td class="actions">
            <router-link :to="{ name: 'TheEditCreate', query: {isEditing: this.isEditing, entityType: this.isRoom, id: room.id} }" v-if="$props.isAdmin">
              <FontAwesomeIcon :icon="faPenToSquare" />
            </router-link>
            <a @click="addToCart(room.id)" v-if="isLogged && !inCart.includes(room.id)">
              <FontAwesomeIcon :icon="faShoppingCart" />
            </a>
            <a @click="removeFromCart(room.id)" v-else-if="isLogged && inCart.includes(room.id)">
              <FontAwesomeIcon :icon="faCancel" />
            </a>
            <a @click="removeRoom(room.id)" v-if="isAdmin" >
              <FontAwesomeIcon :icon="faTrash" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
<script>
import '../styles/TheDashBoard.css'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPenToSquare, faShoppingCart, faTrash, faCancel } from "@fortawesome/free-solid-svg-icons";
import axios from '../axios'

export default {
  name: 'TheDashBoard',
  props: ['isAdmin', 'reloadPage', 'isLogged'],
  data() {
    return {
      isEditing: 'Редагувати',
      isLocation: 'Локація',
      isRoom: 'Кімната',
      faPenToSquare: faPenToSquare,
      faShoppingCart: faShoppingCart,
      faTrash: faTrash,
      faCancel: faCancel,
      rooms: [],
      inCart: []
    }
  },
  async mounted() {
    try {
      if (this.isLogged){
        let reservations = await axios.get('api/cart')
        for (let reservation of reservations.data) {
          let { room_id } = reservation
          this.inCart.push(room_id)
        }
      }

      let rooms = await axios.get('api/rooms')

      if (rooms) {
        this.rooms = rooms.data
      }
      console.log(this.rooms)
    } catch (error) {
      console.log(error.toString())
    }
  },
  methods: {
    async removeRoom(id) {
      try {
        await axios.delete(`api/rooms/${id}`)
        this.$props.reloadPage()
      } catch (error) {
        console.log(error.toString())
      }
    },
    async addToCart(id) {
      try {
          await axios.post(`api/cart/${id}`)
          this.$props.reloadPage()
      } catch (error) {
        console.log(error.toString())
      }
    },
    async removeFromCart(id) {
      try {
        await axios.delete(`api/cart/${id}`)
        this.$props.reloadPage()
      } catch (error) {
        console.log(error.toString())
      }
    }
  },
  components: { FontAwesomeIcon }
}
</script>
