// src/router/beforeEach.js

export default function (router) {
    router.beforeEach((to, from, next) => {
      const isAuthenticated = Boolean(sessionStorage.getItem("access-token")); // Check if access token exists
  
      if (to.meta.requiresAuth && !isAuthenticated) {
        // Redirect unauthenticated users to the login page with a redirect query
        next({
          path: "/",
          query: { redirectTo: to.fullPath },
        });
      } else {
        // Proceed to the requested route
        next();
      }
    });
  }