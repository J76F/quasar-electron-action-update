<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar Test App
        </q-toolbar-title>
        <div>App v{{ version }}</div>
        <q-space />
        <div>{{ autoUpdateMessage }}</div>
        <q-circular-progress
          v-if="autoUpdateDownloadPercent"
          :indeterminate="indeterminateProgress"
          :show-value="!indeterminateProgress"
          font-size="12px"
          :value="autoUpdateDownloadPercent"
          size="50px"
          :thickness="0.22"
          color="teal"
          track-color="grey-3"
          class="q-ma-md"
        >
          {{ autoUpdateDownloadPercent }}%
          <q-tooltip>
            {{ autoUpdateDownloadMessage }}
          </q-tooltip>
        </q-circular-progress>
        <q-space />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import PACKAGE from '../../package.json'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      autoUpdateMessage: '',
      autoUpdateDownloadMessage: '',
      autoUpdateDownloadPercent: 0
    }
  },
  computed: {
    indeterminateProgress () {
      return autoUpdateDownloadMessage === 'downloading'
    }
  },
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      version: PACKAGE.version
    }
  },

  created () {
    if (this.$q.platform.is.electron) {
      window.electron.onAutoUpdateMessage((event, message) => {
        this.autoUpdateMessage = message
      })
      window.electron.onAutoUpdateDownload((event, percent, message) => {
        this.autoUpdateDownloadMessage = message
        this.autoUpdateDownloadPercent = percent
      })
    }
  }
})
</script>
