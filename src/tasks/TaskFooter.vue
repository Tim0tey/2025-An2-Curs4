<script setup>
import { useTask } from '@/stores/task';
const taskStore = useTask();

import { ref } from 'vue';
const isAddingTask = ref(false)

const addNewTask = () => {
  taskStore.addTask({
    id: Math.floor(Math.random() * 1000000),
    title: newTaskTitle.value,
    done: false,
    favorite: false
  });
  isAddingTask.value = false;
  newTaskTitle.value = '';
}

const newTaskTitle = ref('');


</script>

<template>
  <br>
  <div v-if="!isAddingTask">
    <button type="button" class="bg-blue-400 text-white px-2 ml-6 rounded" @click="isAddingTask = true">
      + Add new task
    </button>
  </div>
  <div v-else>
    <input v-model="newTaskTitle" type="text" placeholder="Enter task details"
      class="border border-gray-300 rounded px-2 ml-6">
    <button type="button" class="bg-green-400 text-white px-2 ml-2 rounded" @click="addNewTask">
      Save
    </button>
    <button type="button" class="bg-red-400 text-white px-2 ml-2 rounded" @click="isAddingTask = false">
      Cancel
    </button>
  </div>
</template>