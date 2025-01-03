<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
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
import { useRouter } from "vue-router";
const $q = useQuasar();
const menuVisible = ref(false);
const router = useRouter()

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
  router.push("/")
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
</style>
