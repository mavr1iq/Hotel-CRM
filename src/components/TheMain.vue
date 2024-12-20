<template>
  <main>
    <div>
      <Carousel :loop="true" :items-to-show="1">
        <Slide v-for="(image, index) in images" :key="index">
          <img :src="image" class="carousel-image" alt="carousel slide" />
        </Slide>
        <!-- Навігація та індикатори -->
        <template #addons>
          <Pagination />
        </template>
      </Carousel>
    </div>

    <div class="anim-container">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>

    <h1>Типи Апартаментів</h1>

    <div class="subscription-block">
      <div class="subscription-block-item">
        <h2>Звичайний</h2>
        <img src="../assets/hotel2.jpg" alt="1">
        <h3>Ціна</h3>
        <h4>1500 грн/день</h4>
        <a href="#">Забронювати</a>
      </div>
      <div class="subscription-block-item">
        <h2>Звичайний+</h2>
        <img src="../assets/hotel1.jpg" alt="2">
        <h3>Ціна</h3>
        <h4>2000 грн/день</h4>
        <a href="#">Забронювати</a>
      </div>
      <div class="subscription-block-item">
        <h2>Люкс</h2>
        <img src="../assets/hotel3.jpeg" alt="3">
        <h3>Ціна</h3>
        <h4>3000 грн/день</h4>
        <a href="#">Забронювати</a>
      </div>
    </div>

    <div class="anim-container">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>

    <h1>Про нас</h1>
    <div class="contacts">
      <div class="contacts-info">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas feugiat risus in est consectetur mollis.
        Quisque vitae arcu suscipit arcu tristique commodo sit amet commodo velit. Donec tempor nisl neque, in dapibus enim porttitor sit amet. Nunc sed enim odio. Curabitur mattis eget magna id interdum. Donec at enim quis nisi porttitor condimentum.
        Nulla ultricies vestibulum dolor sed egestas. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
        per inceptos himenaeos. In elementum tempor nulla et commodo. Fusce pharetra cursus dolor, ut tempus nibh ornare non.
        Nunc fermentum pharetra lacus, id pretium augue porttitor vitae. Curabitur fermentum dui eu purus consectetur laoreet.
        Aenean mattis orci nec velit sollicitudin placerat. In ac tincidunt leo, id eleifend ipsum. Nam egestas lacinia ligula a
        sagittis. Ut nec augue mattis, viverra velit nec, vulputate dolor. Pellentesque laoreet faucibus nibh. Interdum et malesuada
        fames ac ante ipsum primis in faucibus. Donec accumsan odio auctor, convallis erat sit amet, egestas sapien. Vestibulum eu risus
        varius, tincidunt lectus vitae, sodales arcu. Suspendisse potenti.
      </div>
      <div  class="map">
        <iframe
            width="450"
            height="250"
            class="center"
            referrerpolicy="no-referrer-when-downgrade"
            src="${GOOGLE_API}"
            allowfullscreen>
        </iframe>
      </div>
    </div>
  </main>
</template>

<script>
import '../styles/TheMain.css'
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination } from "vue3-carousel";

export default {
  components: {
    Carousel,
    Slide,
    Pagination
  },
  data() {
    return {
      images: [
        require('../assets/hotel1.jpg'),
        require('../assets/hotel2.jpg'),
        require('../assets/hotel3.jpeg')
      ],
	  google: process.env.GOOGLE_API
    }
  },
  name: 'TheMain'
}
</script>