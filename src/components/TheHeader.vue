<template>
  <header>
    <div class="logo">
      <router-link to="/">
        <img src="../assets/a.jpg" class="logo" alt="logo">
      </router-link>
    </div>
    <div class="menu">
      <div class="session-related" v-if="!$props.isLogged">
        <router-link to="/register" class="menu-a">
          Реєстрація
        </router-link>
        <router-link to="/login" class="menu-a">
          Увійти
        </router-link>
      </div>
      <div class="session-related" v-else>
        <a class="menu-a" @click="logOff">
          Вийти
        </a>
        <router-link to="/cart" class="menu-a">
          <div class="cart">
            <FontAwesomeIcon :icon="faShoppingCart" />
          </div>
        </router-link>
        <div class="session-related" v-if="$props.isAdmin">
          <router-link @click="reloadPage" :to="{ name: 'TheEditCreate', query: {isEditing: this.isEditing, entityType: this.isRoom} }" class="menu-a">
            + Кімната
          </router-link>
          <router-link @click="reloadPage" :to="{ name: 'TheEditCreate', query: {isEditing: this.isEditing, entityType: this.isLocation} }" class="menu-a">
            + Локація
          </router-link>
        </div>
      </div>
      <router-link to="/dashboard" class="menu-a">
        DashBoard
      </router-link>
      <router-link to="/faq" class="menu-a">
        FAQ
      </router-link>
    </div>
  </header>
</template>

<script>
import "../styles/TheHeader.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";


export default {
  name: "TheHeader",
  props: ['logOff', 'isLogged','isAdmin', 'reloadPage'],
  data() {
    return {
      faShoppingCart: faShoppingCart,
      isEditing: 'Створити',
      isLocation: 'Локація',
      isRoom: 'Кімната'
    }
  },
  components: { FontAwesomeIcon },
};
</script>