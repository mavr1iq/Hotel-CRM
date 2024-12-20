<template>
  <footer>
    <div class="footer-info">
      <router-link to="/faq" class="footer-info-a">
        Контакти
      </router-link>
      <router-link to="/dashboard" class="footer-info-a">
        Апартаменти
      </router-link>
      <router-link to="/faq" class="footer-info-a">
        Про нас
      </router-link>
    </div>
    <div class="icons">
      <a href="tel:+382345678900" target="_blank">
        <FontAwesomeIcon :icon="faPhone" />
      </a>
      <a href="mailto:kivar2006@gmail.com" target="_blank">
        <FontAwesomeIcon :icon="faEnvelope" />
      </a>
      <a href="https://t.me/krlvrvd" target="_blank">
        <FontAwesomeIcon :icon="faTelegram" />
      </a>
      <a href="viber://chat?number=12345678" target="_blank">
        <FontAwesomeIcon :icon="faViber" />
      </a>
    </div>
  </footer>
</template>

<script>
import '../styles/TheFooter.css'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faViber, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { defineComponent } from "vue";


export default defineComponent({
  data() {
    return {
      faPhone: faPhone,
      faEnvelope: faEnvelope,
      faTelegram: faTelegram,
      faViber: faViber
    }
  },
  name: 'TheFooter',
  components: { FontAwesomeIcon }
})
</script>