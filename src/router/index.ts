import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/auth/mockAuth";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/LoginPage.vue"),
      meta: { title: "Вход", public: true },
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/pages/DashboardPage.vue"),
      meta: { title: "Дашборд" },
    },
    {
      path: "/topics",
      name: "topics",
      component: () => import("@/pages/TopicsPage.vue"),
      meta: { title: "Лента событий" },
    },
    {
      path: "/topics/:id",
      name: "topic-detail",
      component: () => import("@/pages/TopicDetailPage.vue"),
      meta: { title: "Карточка темы" },
    },
    {
      path: "/analytics",
      name: "analytics",
      component: () => import("@/pages/AnalyticsPage.vue"),
      meta: { title: "Аналитика" },
    },
    {
      path: "/reports",
      name: "reports",
      component: () => import("@/pages/ReportsPage.vue"),
      meta: { title: "Отчёты" },
    },
    {
      path: "/sources",
      name: "sources",
      component: () => import("@/pages/SourcesPage.vue"),
      meta: { title: "Источники" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFoundPage.vue"),
      meta: { title: "Страница не найдена", public: true },
    },
  ],
});

router.beforeEach((to) => {
  document.title = `${to.meta.title || "Минцифры"} — Минцифры`;

  // Защита маршрутов: неавторизованных → на /login
  if (!to.meta.public && !auth.isLoggedIn()) {
    return { name: "login" };
  }

  // Авторизованный не должен видеть страницу входа
  if (to.name === "login" && auth.isLoggedIn()) {
    return { name: "dashboard" };
  }
});

export default router;
