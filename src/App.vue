<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as d3 from 'd3'
import { DataRow } from './components'

const dataArray = ref([])
const currentPage = ref(1)
const rowsPerPage = 10
const pageData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return dataArray.value.slice(start, start + rowsPerPage)
})
const totalPages = computed(() => Math.ceil(dataArray.value.length / rowsPerPage))

function goToPage(page) {
  currentPage.value = page
}


onMounted(async () => {
  const parseDate = d3.timeParse('%-m/%-d/%Y %I:%M:%S %p')

  const lines = await d3.csv('./balt_311.csv')
  const processed = lines.map(d => ({
    // ...d,
    Agency: d.Agency.trim(),
    CreatedDate: parseDate(d.CreatedDate),
    CloseDate: parseDate(d.CloseDate),
    DueDate: parseDate(d.DueDate),
    StatusDate: parseDate(d.StatusDate),
    Latitude: +d.Latitude,
    Longitude: +d.Longitude,
    PoliceDistrict: d.PoliceDistrict.trim(),
    PolicePost: d.PolicePost.trim(),
    Neighborhood: d.Neighborhood.trim(),
    ZipCode: d.ZipCode.trim()
  }))

  // setTimeout(() => {
    dataArray.value = processed
  //   console.log('Processed data:', processed)
  // }, 2000)
  
})
</script>

<template>
  <div class="container">
    <h1>311 Calls in Baltimore city</h1>
    <p>Explore calls made in 2025</p>
    <div v-if="dataArray.length > 0">
      <p>Data loaded: {{ dataArray.length }} records</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Agency</th>
          <th>CreatedDate</th>
          <th>CloseDate</th>
          <th>PoliceDistrict</th>
          <th>Neighborhood</th>
        </tr>
      </thead>
      <tbody>
        <DataRow 
          v-for="(data, index) in pageData" 
          :key="index" 
          :data="data"
        />
      </tbody>
    </table>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next</button>
    </div>

  </div>
</template>

<style scoped>
.container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
  max-width: 90rem;
  margin: 0 auto;
}

h1 {
  color: #000000;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #000000;
}
</style>
