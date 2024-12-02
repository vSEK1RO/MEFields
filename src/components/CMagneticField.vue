<script setup lang="ts">
import { inject } from 'vue';
import { CSwitch } from '.';
import { KEY_APP } from '../App.vue';

const ctx = inject(KEY_APP)!
</script>

<template>
  <div>
    <c-switch :disabled="!ctx.loadedName">
      <div class="flex f-gap-xs">
        <span> Show magnetic field </span>
        <!-- <div class="i-material-symbols:panorama-photosphere-outline w-1em h-1em"/> -->
      </div>
    </c-switch>
  </div>
</template>