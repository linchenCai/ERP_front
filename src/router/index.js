import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import index from '../views/index.vue'
import AddCustomer from "@/views/AddCustomer.vue";
import ListCustomer from "@/views/ListCustomer.vue";


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },  {
    path: '/index',
    name: 'index',
    component: index
  },{
    path: '/AddCustomer',
    name: 'AddCustomer',
    component: AddCustomer
  },{
    path: '/ListCustomer',
    name: 'ListCustomer',
    component: ListCustomer
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
