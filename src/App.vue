<template>
  <div class="container">
    <TheHeader :key="reload" :logOff="logOff" :reloadPage="reloadPage" :is-logged='isLogged' :is-admin="isAdmin"/>
    <main class="main">
      <router-view :key="reload" :is-admin="isAdmin" :reloadPage="reloadPage" :is-logged='isLogged'></router-view>
    </main>
    <TheFooter/>
  </div>
</template>


<script>
import './styles/App.css'
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import axios from "./axios";

export default {
  name: 'App',
  data() {
    return {
      reload: 0,
      isLogged: false,
      role: false,
      isAdmin: false
    }
  },
  components: {
    TheHeader,
    TheFooter
  },
  methods: {
    reloadPage() {
      this.reload += 1
      console.log(this.reload)
    },
    async logOff() {
      try{
        await axios.get("api/logoff")
        this.isLogged = false
        this.reloadPage()
      } catch (error) {
        console.log(error.toString())
      }
    }
  },
  mounted() {
    this.$router.afterEach(async () => {
      try {
        const response = await axios.get('api/user')

        if (response) {
          this.isLogged = true
        }

        let admins = await axios.get('api/admins')

        admins = admins.data.map((admin) => (admin.id))

        this.isAdmin = admins.includes(response.data.id);
        console.log(response.data)
      } catch (error) {
        console.log(error.toString())
      }
    })
  }
}
</script>
