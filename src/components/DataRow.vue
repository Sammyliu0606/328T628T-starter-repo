<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
</script>

<template>
  <tr>
    <td>{{ data.Agency }}</td>
    <td>{{ data.CreatedDate }}</td>
    <td>{{ data.CloseDate }}</td>
    <td>{{ data.PoliceDistrict }}</td>
    <td>{{ data.Neighborhood }}</td>
  </tr>
</template>

<style scoped>

</style>