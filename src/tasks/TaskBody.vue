<script setup>
const emit = defineEmits(['update:task:title']);
const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

import TaskCheckBox from './TaskCheckBox.vue';
import TaskActions from './TaskActions.vue';
import { ref } from 'vue';
const isEditMode = ref(false);

const taskEditTitle = ref(props.task.title);

const saveTaskTitle = () => {
  emit('update:task:title', taskEditTitle.value);
  isEditMode.value = false;
}
</script>
<template>
  <div class="grid grid-cols-6 gap-2">
    <TaskCheckBox :taskId="task.id" :isDone="task.done" />
    <div v-if="!isEditMode" class="col-span-3" @click="isEditMode = true">{{ task.title }}</div>
    <div v-else class="col-span-3">
      <input v-model="taskEditTitle" type="text" class="w-full bg-gray-100" @keyup.enter="saveTaskTitle" />
    </div>
    <TaskActions :taskId="task.id" :isFavorite="task.favorite" />
  </div>
</template>