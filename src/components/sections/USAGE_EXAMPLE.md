<!-- SAMPLE USAGE AND DATA EXAMPLE -->

<!--
To use PropertyListingCard.vue in your views, import and pass property data like this:

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
    <PropertyListingCard
      v-for="property in properties"
      :key="property.id"
      :property="property"
      @view-details="handleViewDetails"
    />
  </div>
</template>

<script setup>
import PropertyListingCard from '@/components/sections/PropertyListingCard.vue'
import { ref } from 'vue'

const properties = ref([
  {
    id: 1,
    title: 'Luxury Modern Apartment in Ikoyi',
    location: 'Ikoyi, Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    price: 450000000, // ₦450,000,000
    status: 'For Sale',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 5500
  },
  {
    id: 2,
    title: 'Beautiful Family House in Lekki',
    location: 'Lekki, Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop',
    price: 85000000, // ₦85,000,000 per annum
    status: 'For Rent',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 4200
  },
  {
    id: 3,
    title: 'Premium Penthouse in Victoria Island',
    location: 'Victoria Island, Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1512917774080-9e6e87b2d7d7?w=500&h=400&fit=crop',
    price: 750000000, // ₦750,000,000
    status: 'Sold',
    bedrooms: 5,
    bathrooms: 4,
    squareFootage: 8000
  },
  {
    id: 4,
    title: 'Cozy Studio in Yaba',
    location: 'Yaba, Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&h=400&fit=crop',
    price: 25000000, // ₦25,000,000
    status: 'For Sale',
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 750
  },
  {
    id: 5,
    title: 'Spacious Duplex in Ajah',
    location: 'Ajah, Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1516156008625-3a9995f1edd1?w=500&h=400&fit=crop',
    price: 35000000, // ₦35,000,000 per annum
    status: 'For Rent',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 6000
  },
  {
    id: 6,
    title: 'Modern Townhouse in Ikoyi',
    location: 'Ikoyi, Lagos, Nigeria',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=400&fit=crop',
    price: 320000000, // ₦320,000,000
    status: 'For Sale',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 3800
  }
])

const handleViewDetails = (propertyId) => {
  console.log('Viewing details for property:', propertyId)
  // Navigate to property detail page or open modal
}
</script>
-->

/* COMPONENT FEATURES:

1. RESPONSIVE DESIGN
   - Fully responsive card layout
   - Works on mobile, tablet, and desktop
   - Image scales smoothly on hover

2. STATUS BADGE
   - Dynamic colors based on status:
     * "For Sale" → Green (#22c55e)
     * "For Rent" → Blue (#3b82f6)
     * "Sold" → Gray (#6b7280)
   - Positioned in top-right corner

3. PRICE FORMATTING
   - Nigerian Naira symbol (₦)
   - Comma-separated thousands (e.g., ₦450,000,000)
   - Computed property for automatic formatting

4. PROPERTY SPECS
   - Bedrooms icon with count
   - Bathrooms icon with count
   - Square footage display
   - Clean grid layout with visual icons

5. HOVER EFFECTS
   - Shadow increases on hover
   - Image zooms slightly on hover
   - Button changes color on hover
   - Smooth transitions

6. ACCESSIBILITY
   - Proper semantic HTML
   - SVG icons for visual appeal
   - Clear button call-to-action
   - Screen reader friendly

7. PROPS VALIDATION
   - Strict prop validation ensures correct data structure
   - Required properties: id, title, location, image, price, status, bedrooms, bathrooms, squareFootage

8. EMITTED EVENTS
   - @view-details: Emits property ID when button is clicked
   - Can be used for navigation or opening modals
*/
