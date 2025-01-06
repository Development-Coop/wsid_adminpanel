<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-image flex-center">
        <q-card
          class="login-card"
          v-bind:style="$q.screen.lt.sm ? { width: '90%' } : { width: '400px' }"
        >
          <q-card-section>
            <q-avatar size="100px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>

          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h5 text-bold text-primary">
                Welcome Back
              </div>
              <div class="col text-caption text-grey-7">
                Log in to your account to continue
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                filled
                dense
                v-model="username"
                label="Username or Email"
                lazy-rules
                clearable
              />
              <q-input
                type="password"
                filled
                dense
                v-model="password"
                label="Password"
                lazy-rules
                clearable
              />

              <div class="flex justify-center">
                <q-btn
                  label="Login"
                  type="button"
                  color="primary"
                  :loading="loading"
                  class="login-btn"
                  @click="handleSubmit"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { useQuasar } from "quasar";

const username = ref("");
const password = ref("");
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const $q = useQuasar();

onMounted(()=> {
  const params = route?.query?.expired?.trim().toLowerCase();
  if (params === "true") {
    $q.notify({
      color: "negative",
      message: "Session is expired! Please login to continue.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
})

const handleSubmit = async () => {
  // Reset loading state
  loading.value = true;

  // Basic validation
  if (!username.value) {
    $q.notify({
      color: "warning",
      message: "Username or Email is required.",
      position: "top",
      icon: "warning",
    });
    loading.value = false;
    return;
  }

  if (!password.value) {
    $q.notify({
      color: "warning",
      message: "Password is required.",
      position: "top",
      icon: "warning",
    });
    loading.value = false;
    return;
  }

  // Password length check (example: minimum 8 characters)
  if (password.value.length < 8) {
    $q.notify({
      color: "warning",
      message: "Password must be at least 8 characters long.",
      position: "top",
      icon: "warning",
    });
    loading.value = false;
    return;
  }

  try {
    const data = {
      emailOrUsername: username.value,
      password: password.value,
    };

    await authStore.login(data);
    const redirectTo = router.currentRoute.value.query.redirectTo || "/dashboard";

    // Redirect to the specified path or default to the dashboard
    router.push(redirectTo);
  } catch (error) {
    $q.notify({
      color: "negative",
      message: error.response?.data?.message || "Login failed. Please try again.",
      position: "top",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
// Variables
$primary-color: #ff5732;
$secondary-color: #ff8c5a;
$light-overlay: rgba(255, 255, 255, 0.1);
$glass-overlay: rgba(255, 255, 255, 0.2);
$glass-border: rgba(255, 255, 255, 0.4);

.bg-image {
  background: linear-gradient(90deg, $primary-color 0%, rgba(30, 41, 59, 1) 100%);
  // background: linear-gradient(135deg, $primary-color, $secondary-color); /* Base gradient */
  background-size: 300% 300%; /* Creates a dynamic flow for the gradient */
  animation: gradient-flow 6s ease infinite; /* Animated gradient */

  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-card {
  position: relative;
  z-index: 10; // Ensures the card appears on top
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2); // Subtle shadow for depth
  color: white; // Ensure text contrasts well
}
</style>
