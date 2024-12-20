<template>
  <main>
    <h2>Checkout</h2>
    <form @submit.prevent="confirmOrder">
      <label>
        Передоплата:
        <input v-model="prepayment" type="number" required @input="validateNumber" />
      </label>
      <p v-if="errors.numberError">{{errors.numberError}}</p>
      <a @click="confirmOrder" class="button" type="submit">Підтвердити</a>
      <p v-if="errors.billingError">{{errors.billingError}}</p>
    </form>
  </main>
</template>

<script>
import '../styles/TheCheckout.css'
import axios from '../axios'
export default {
  name: 'TheCheckout',
  data() {
    return {
      prepayment: null,
      errors: {}
    };
  },
  methods: {
    async confirmOrder() {
      this.validateNumber()

      try {
        if (Object.values(this.errors).length === 0) {
          const response = await axios.post('api/billing', {amount: this.prepayment})

          if (response) {
            delete this.errors["billingError"]
            await this.deleteFromCart()
            alert(`Замовлення підтверджено. Передоплата: ${this.prepayment}`);
            this.$router.push("/");
          }
        } else {
          this.errors["billingError"] = "Problem with purchasing"
        }

      } catch (error) {
        this.errors["billingError"] = "Problem with purchasing"
        console.log(error.toString())
      }

    },
    validateNumber() {
      if (this.prepayment) {
        if (this.prepayment.toString().match(/[0-9]{1,40}/g) && this.prepayment > 0) {
          delete this.errors["billingError"]
          delete this.errors["numberError"]
        } else {
          this.errors["numberError"] = "Number should be larger than 0 and contain digits"
        }
      } else {
        this.errors["numberError"] = "Enter number"
      }
    },
    async deleteFromCart() {
      try {
        const items = await axios.get('api/cart')

        for (let item of items.data) {
          await axios.delete(`api/cart/${item.room_id}`)
        }
      } catch (error) {
        console.log(error.toString())
      }
    }
  },
};
</script>
