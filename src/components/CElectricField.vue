<script setup lang="ts">
import { inject } from 'vue';
import { CSwitch } from '.';
import { KEY_APP } from '../App.vue';

const ctx = inject(KEY_APP)!
</script>

<template>
  <div>
    <c-switch :disabled="!ctx.loadedName.value">
      <div class="flex f-gap-xs">
        <span> Show electric field </span>
      </div>
    </c-switch>
  </div>
</template>