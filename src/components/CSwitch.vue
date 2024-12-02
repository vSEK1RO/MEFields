<script setup lang="ts" generic="T1, T2">
import { ref } from 'vue'

const props = defineProps<{
  active?: T1
  inactive?: T2
  disabled?: boolean
  loading?: boolean
  isActive?: boolean
}>()

const active = ref(!!props.isActive)

const emit = defineEmits<{
  (e: 'click', value: any): void,
  (e: 'active', value?: T1): void,
  (e: 'inactive', value?: T2): void,
}>()

function onClick() {
  active.value = !active.value
  if (active.value) {
    emit('click', props.active)
    emit('active', props.active)
  } else {
    emit('click', props.inactive)
    emit('click', props.inactive)
  }
}
</script>

<template>
  <div>
    <el-button
      @click="onClick"
      :disabled
      :loading
      :type="active ? 'primary' : 'default'"
      class="prose-btn! w-full"
    >
      <slot />
    </el-button>
  </div>
</template>