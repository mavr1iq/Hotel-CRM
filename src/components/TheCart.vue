<template>
  <main>
    <h2>Кошик</h2>
    <table>
      <thead>
      <tr>
        <th>Назва</th>
        <th>Опис</th>
        <th>Адреса</th>
        <th>Дії</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in cart" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.address }}</td>
        <td>
          <a class='cancel' @click="removeFromCart(item.id)" >
            <FontAwesomeIcon :icon="faCancel" />
          </a>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="cart.length !== 0">
      <router-link to="/checkout"><div class="check">Підтвердити замовлення</div></router-link>
    </div>
  </main>
</template>

<script>
import axios from '../axios'
import '../styles/TheCart.css'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCancel } from "@fortawesome/free-solid-svg-icons";
export default {
  name: 'TheCart',
  props: ['reloadPage'],
  async mounted() {
    try {
      const response = await axios.get('api/cart')
      for (let room of response.data) {
        let info = await axios.get(`api/rooms/${room.room_id}`)
        console.log(info.data)
        this.cart.push(info.data)
      }
      console.log(this.cart)
    } catch (e) {
      console.log(e.toString())
    }
  },
  data() {
    return {
      cart: [],
      faCancel: faCancel
    }
  },
  methods: {
    async removeFromCart(id) {
      console.log(id)
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