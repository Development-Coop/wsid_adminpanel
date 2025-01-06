<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title> WSID Admin </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="handleFullscreenClick"
            v-if="$q.screen.gt.sm"
          >
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px" @click.self="toggleMenu">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-btn>
          <q-menu
            v-model="menuVisible"
            anchor="bottom right"
            self="top right"
            transition-show="flip-up"
            transition-hide="flip-down"
          >
            <q-list>
              <q-item clickable v-ripple @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            class="bg-primary text-white"
          >
            <q-list>
              <q-item to="/dashboard" active-class="active-drawer-item" :active="isActiveRoute('/dashboard')" @click.stop>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Users</q-item-label>
                </q-item-section>
              </q-item>
              <q-item to="/post" active-class="active-drawer-item" :active="isActiveRoute('/post')" @click.stop>
                <q-item-section avatar>
                  <q-icon name="table_chart" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Posts</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-drawer>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
const $q = useQuasar();
const menuVisible = ref(false);
const leftDrawerOpen = ref(false);
const router = useRouter();
const route = useRoute();

const toggleMenu = (event) => {
  event.stopPropagation(); // Prevent the click event from propagating
  menuVisible.value = !menuVisible.value;
};

const handleFullscreenClick = (event) => {
  event.stopPropagation(); // Prevents triggering any other click events
  $q.fullscreen.toggle();
};

const logout = () => {
  sessionStorage.clear();
  router.push("/");
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const isActiveRoute = (path) => {
  return route.path === path;
};
</script>

<style>
/* FONT AWESOME GENERIC BEAT */
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.25);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1);
  }
  55% {
    transform: scale(1.25);
  }
  70% {
    transform: scale(1);
  }
}
.active-drawer-item {
  background-color: rgba(255, 255, 255, 0.2); /* Primary color for active item */
  color: white;
}

.q-drawer .q-item {
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth hover effect */
}

.q-drawer .q-item:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Subtle hover effect */
}

.q-item-section {
  display: flex;
  align-items: center;
}
</style>
