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

// Navigation guard to handle authentication
router.beforeEach((to, from, next) => {
  const publicRoutes = ['/login', '/']
  
  // Check if user is authenticated by looking at localStorage
  const isAuthenticated = localStorage.getItem('auth_authenticated') === 'true'
  
  // If not authenticated and not on public route, redirect to login
  if (!isAuthenticated && !publicRoutes.includes(to.path)) {
    next('/login')
    return
  }
  
  // If authenticated and trying to access login, redirect to home
  if (isAuthenticated && to.path === '/login') {
    next('/')
    return
  }
  
  // Otherwise, proceed as normal
  next()
})

export default router
