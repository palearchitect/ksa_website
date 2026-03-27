<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-3xl font-bold mb-6">Manage Appointments</h1>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Time</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in upcomingAppointments" :key="appointment.id" class="hover:bg-gray-50">
              <td class="border border-gray-300 px-4 py-2 font-mono text-sm">{{ appointment.id }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ appointment.name }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <a :href="`mailto:${appointment.email}`" class="text-blue-600 hover:text-blue-800">{{ appointment.email }}</a>
              </td>
              <td class="border border-gray-300 px-4 py-2">{{ appointment.phone }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ formatDate(appointment.date) }}</td>
              <td class="border border-gray-300 px-4 py-2">{{ appointment.time }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <span :class="getStatusClass(appointment.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ appointment.status }}
                </span>
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center">
                <button
                  v-if="appointment.status === 'pending'"
                  @click="updateStatus(appointment.id, 'confirmed')"
                  class="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 mr-1"
                >Confirm</button>
                <button
                  v-if="appointment.status === 'confirmed'"
                  @click="updateStatus(appointment.id, 'completed')"
                  class="bg-purple-500 text-white px-2 py-1 rounded text-sm hover:bg-purple-600 mr-1"
                >Complete</button>
                <button
                  v-if="appointment.status !== 'cancelled' && appointment.status !== 'completed'"
                  @click="updateStatus(appointment.id, 'cancelled')"
                  class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >Cancel</button>
              </td>
            </tr>
            <tr v-if="upcomingAppointments.length === 0">
              <td colspan="8" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
                No appointments found. Bookings made via the Book a Tour page will appear here.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 grid grid-cols-4 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-gray-600">Total</p>
          <p class="text-3xl font-bold text-blue-600">{{ bookingStore.stats.total }}</p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-gray-600">Pending</p>
          <p class="text-3xl font-bold text-yellow-600">{{ bookingStore.stats.pending }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-gray-600">Confirmed</p>
          <p class="text-3xl font-bold text-green-600">{{ bookingStore.stats.confirmed }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-gray-600">Completed</p>
          <p class="text-3xl font-bold text-gray-600">{{ bookingStore.stats.completed }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookingStore } from '@/stores/bookingStore'

const bookingStore = useBookingStore()

// Load sample data if empty
if (bookingStore.bookings.length === 0) {
  bookingStore.loadSampleData()
}

// Show all bookings sorted by date (upcoming first)
const upcomingAppointments = computed(() => {
  return [...bookingStore.bookings].sort((a, b) => new Date(a.date) - new Date(b.date))
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const updateStatus = (id, newStatus) => {
  const action = newStatus === 'cancelled' ? 'cancel' : newStatus
  if (confirm(`Are you sure you want to ${action} this appointment?`)) {
    bookingStore.updateBookingStatus(id, newStatus)
  }
}
</script>
