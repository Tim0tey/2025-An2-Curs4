import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'

// Import pages
import ShopPage from '@/pages/ShopPage.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import CartPage from '@/pages/CartPage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import PlayerPage from '@/pages/PlayerPage.vue'
import VinylDetailPage from '@/pages/VinylDetailPage.vue'
import CollectionPage from '@/pages/CollectionPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ShopPage
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopPage
  },
    {
    path: '/cart',
    name: 'cart',
    component: CartPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesPage
  },
    {
    path: '/player',
    name: 'player',
    component: PlayerPage
  },
  {
    path: '/vinyl/:id',
    name: 'vinyl-detail',
    component: VinylDetailPage
  },
  {
    path: '/collection',
    name: 'collection',
    component: CollectionPage
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CartPage
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/components/dashboard/DashboardPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  linkActiveClass: 'btn-primary border'
})

// Navigation guard temporarily disabled for development
// router.beforeEach((to, from, next) => {
//   const publicRoutes = ['/login']
//   
//   // Simple check - redirect to login if not on public route
//   if (!publicRoutes.includes(to.path)) {
//     // Check localStorage directly to avoid store initialization issues
//     const isAuthenticated = localStorage.getItem('auth_authenticated') === "true"
//     
//     if (!isAuthenticated) {
//       next('/login')
//       return
//     }
//   }
//   
//   next()
// })

export default router
