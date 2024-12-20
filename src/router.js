import { createRouter, createWebHistory } from "vue-router";
import TheMain from "@/components/TheMain.vue";
import TheFAQ from "@/components/TheFAQ.vue";
import TheDashBoard from "@/components/TheDashBoard.vue";
import TheLogin from "@/components/TheLogin.vue";
import TheRegister from "@/components/TheRegister.vue";
import TheEditCreate from "@/components/TheEditСreate.vue";
import TheCheckout from "@/components/TheCheckout.vue";
import TheCart from "@/components/TheCart.vue";


const routes = [
    {
        path: "/",
        component: TheMain,
        meta: { title: "Hotel CRM" },
    },
    {
        path: "/faq",
        component: TheFAQ,
        meta: { title: "FAQ page" },
    },
    {
        path: "/dashboard",
        component: TheDashBoard,
        meta: { title: "Dashboard page" },
    },
    {
        path: "/login",
        component: TheLogin,
        meta: { title: "Login page" },
    },
    {
        path: "/register",
        component: TheRegister,
        meta: { title: "Register page" },
    },
    {
        path: "/createEdit",
        name: 'TheEditCreate',
        component: TheEditCreate,
        meta: { title: "Create and edit page" },
        props: true
    },
    {
        path: "/checkout",
        component: TheCheckout,
        meta: { title: "Checkout page" },
    },
    {
        path: "/cart",
        component: TheCart,
        meta: { title: "Cart page" },
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || "Hotel CRM";
    next();
});

export default router;