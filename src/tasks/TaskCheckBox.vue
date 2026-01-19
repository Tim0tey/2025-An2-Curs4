<script setup>
  import {useTask} from '@/stores/task';
  const taskStore = useTask();
  
  defineProps({
    taskId: {
      type: Number,
      required: true
    },
    isDone: {
      type: Boolean,
      required: true
    }
  })
</script>
<template>
  <div class="flex justify-center items-center">
    <input :checked="isDone" type="checkbox" @click="taskStore.toggleDone(taskId)" />
  </div>
</template>