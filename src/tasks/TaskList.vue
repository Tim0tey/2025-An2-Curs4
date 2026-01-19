<script setup>
import { useTask } from '@/stores/task';
const taskStore = useTask();

import TaskHeader from './TaskHeader.vue';
import TaskBody from './TaskBody.vue';
import TaskFooter from './TaskFooter.vue';

import { onMounted } from 'vue';
onMounted(() => {
  const tasks = localStorage.getItem("tasks");
  if (tasks) {
    taskStore.$patch({ tasks: JSON.parse(tasks) });
  }
});
</script>
<template>
  <TaskHeader />
  <TaskBody v-for="(task, index) in taskStore.tasks" :key="index" :task="task"
    @update:task:title="newTitle => taskStore.updateTaskTitle(task.id, newTitle)" />
  <TaskFooter />
</template>