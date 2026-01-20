import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/login/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import ForgotPasswordPage from '@/pages/login/ForgotPasswordPage.vue'
import Shop from '@/pages/Shop.vue'
import ProductDetailsPage from '@/pages/ProductDetailsPage.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import CartPage from '@/pages/shoppage/CartPage.vue'
import CategoriesPage from '@/pages/CategoriesPage.vue'
import CustomerServicePage from '@/pages/help/CustomerServicePage.vue'
import FeedbackPage from '@/explainer/FeedbackPage.vue'
import ChatSellersPage from '@/pages/customer/ChatSellersPage.vue'
import AboutUsPage from '@/explainer/AboutUsPage.vue'
import HowToBuyPage from '@/explainer/HowToBuyPage.vue'
import HowToSellPage from '@/explainer/HowToSellPage.vue'
import HelpPage from '@/explainer/HelpPage.vue'
import UserProfilePage from '@/pages/customer/UserProfilePage.vue'
import SellItemsPage from '@/pages/customer/SellItemsPage.vue'
import OrderHistoryPage from '@/pages/customer/OrderHistoryPage.vue'
import ContactPage from '@/pages/explainer/ContactPage.vue'
import PrivacyPage from '@/explainer/PrivacyPage.vue'
import { useAuth } from '@/stores/auth'

const routes = [
  { path: "/", component: Shop },
  { path: "/shop", component: Shop },
  { path: "/product/:id", component: ProductDetailsPage },
  { path: "/favorites", component: FavoritesPage },
  { path: "/cart", component: CartPage },
  { path: "/categories", component: CategoriesPage },
  { path: "/customer-service", component: CustomerServicePage },
  { path: "/feedback", component: FeedbackPage },
  { path: "/chat-sellers", component: ChatSellersPage },
  { path: "/about-us", component: AboutUsPage },
  { path: "/how-to-buy", component: HowToBuyPage },
  { path: "/how-to-sell", component: HowToSellPage },
  { path: "/help", component: HelpPage },
  { path: "/user-profile", component: UserProfilePage },
  { path: "/sell-items", component: SellItemsPage },
  { path: "/order-history", component: OrderHistoryPage },
  { path: "/contact", component: ContactPage },
  { path: "/privacy", component: PrivacyPage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/forgot-password", component: ForgotPasswordPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'btn-primary border'
})

router.beforeEach((to) => {
  const auth = useAuth()
  const publicPaths = ['/login', '/register', '/forgot-password']
  
  if (!publicPaths.includes(to.path) && !auth.isAuthenticated) {
    return '/login'
  }
  
  if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
    return '/'
  }
})

export default router
