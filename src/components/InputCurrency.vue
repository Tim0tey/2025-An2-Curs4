<template>
  <div class="relative">
    <span class="text-gray-500">$</span>
    <input
      :value="modelValue"
      @input="$emit('update', $event.target.value)"
      type="number"
      step="0.01"
      min="0"
      class="pl-6 pr-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      placeholder="0.00"
    />
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update'])
</script>
