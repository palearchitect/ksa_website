<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Property Insights & Updates</h1>
        <p class="text-lg text-gray-600 max-w-3xl">
          Stay informed with the latest property market trends, investment tips, and company updates from Nigeria's premier property valuers.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-3 lg:gap-8">
        <!-- Blog Posts Column -->
        <div class="lg:col-span-2">
          <!-- Featured Post -->
          <div v-if="featuredPost" class="mb-12">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                :src="featuredPost.image" 
                :alt="featuredPost.title"
                class="w-full h-64 object-cover"
              />
              <div class="p-8">
                <div class="flex items-center gap-4 mb-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                  <span class="text-gray-500 text-sm">{{ featuredPost.date }}</span>
                  <span class="text-gray-500 text-sm">•</span>
                  <span class="text-gray-500 text-sm">{{ featuredPost.readTime }}</span>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-3">
                  {{ featuredPost.title }}
                </h2>
                <p class="text-gray-600 mb-6">
                  {{ featuredPost.excerpt }}
                </p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img 
                      :src="featuredPost.author.avatar" 
                      :alt="featuredPost.author.name"
                      class="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p class="font-medium text-gray-900">{{ featuredPost.author.name }}</p>
                      <p class="text-sm text-gray-500">{{ featuredPost.author.role }}</p>
                    </div>
                  </div>
                  <button 
                    @click="viewPost(featuredPost.id)"
                    class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Read Article
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Posts -->
          <div class="mb-12">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Recent Articles</h2>
              <div class="flex items-center space-x-4">
                <select v-model="categoryFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Categories</option>
                  <option value="market-trends">Market Trends</option>
                  <option value="investment">Investment Tips</option>
                  <option value="property-valuation">Property Valuation</option>
                  <option value="legal">Legal Insights</option>
                  <option value="company">Company Updates</option>
                </select>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div 
                v-for="post in filteredPosts" 
                :key="post.id"
                class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <img 
                  :src="post.image" 
                  :alt="post.title"
                  class="w-full h-48 object-cover"
                />
                <div class="p-6">
                  <div class="flex items-center gap-3 mb-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="getCategoryClass(post.category)"
                    >
                      {{ post.categoryLabel }}
                    </span>
                    <span class="text-gray-500 text-sm">{{ post.date }}</span>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">{{ post.title }}</h3>
                  <p class="text-gray-600 text-sm mb-4">{{ post.excerpt }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <img 
                        :src="post.author.avatar" 
                        :alt="post.author.name"
                        class="w-8 h-8 rounded-full mr-2"
                      />
                      <span class="text-sm text-gray-700">{{ post.author.name }}</span>
                    </div>
                    <button 
                      @click="viewPost(post.id)"
                      class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More Button -->
            <div class="text-center mt-8">
              <button 
                @click="loadMorePosts"
                v-if="visiblePosts < posts.length"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Load More Articles
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Categories -->
          <div class="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <div class="space-y-3">
              <button 
                v-for="category in categories" 
                :key="category.id"
                @click="categoryFilter = category.id"
                class="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                :class="{ 'bg-blue-50 text-blue-700': categoryFilter === category.id }"
              >
                <span class="font-medium">{{ category.name }}</span>
                <span class="text-gray-500 text-sm">{{ category.count }}</span>
              </button>
            </div>
          </div>

          <!-- Recent Comments -->
          <div class="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Comments</h3>
            <div class="space-y-4">
              <div 
                v-for="comment in recentComments" 
                :key="comment.id"
                class="border-b border-gray-100 pb-4 last:border-0"
              >
                <div class="flex items-start">
                  <img 
                    :src="comment.author.avatar" 
                    :alt="comment.author.name"
                    class="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p class="font-medium text-gray-900 text-sm">{{ comment.author.name }}</p>
                    <p class="text-gray-600 text-xs mb-1">on "{{ comment.postTitle }}"</p>
                    <p class="text-gray-700 text-sm">{{ comment.content.substring(0, 60) }}...</p>
                    <p class="text-gray-500 text-xs mt-1">{{ comment.time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Newsletter Signup -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md p-6">
            <h3 class="text-lg font-bold text-white mb-3">Stay Updated</h3>
            <p class="text-blue-100 text-sm mb-4">
              Get the latest property insights and investment tips directly to your inbox.
            </p>
            <div class="space-y-3">
              <input 
                v-model="email"
                type="email" 
                placeholder="Your email address"
                class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button 
                @click="subscribeNewsletter"
                class="w-full px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Subscribe Now
              </button>
            </div>
            <p class="text-blue-200 text-xs mt-4">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Detail Modal -->
    <div v-if="selectedPost" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="selectedPost = null"></div>
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Post Content -->
          <div class="p-8">
            <!-- Post Header -->
            <div class="flex items-center justify-between mb-6">
              <button 
                @click="selectedPost = null"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <img 
              :src="selectedPost.image" 
              :alt="selectedPost.title"
              class="w-full h-96 object-cover rounded-xl mb-8"
            />

            <div class="flex items-center gap-4 mb-6">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                :class="getCategoryClass(selectedPost.category)"
              >
                {{ selectedPost.categoryLabel }}
              </span>
              <span class="text-gray-500">{{ selectedPost.date }}</span>
              <span class="text-gray-500">•</span>
              <span class="text-gray-500">{{ selectedPost.readTime }}</span>
            </div>

            <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ selectedPost.title }}</h2>

            <div class="flex items-center mb-8">
              <img 
                :src="selectedPost.author.avatar" 
                :alt="selectedPost.author.name"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p class="font-bold text-gray-900">{{ selectedPost.author.name }}</p>
                <p class="text-gray-600">{{ selectedPost.author.role }}</p>
              </div>
            </div>

            <div class="prose max-w-none mb-8">
              <p class="text-gray-700 mb-4">{{ selectedPost.content }}</p>
            </div>

            <!-- Comments Section -->
            <div class="border-t border-gray-200 pt-8">
              <h3 class="text-xl font-bold text-gray-900 mb-6">
                Comments ({{ selectedPost.comments.length }})
              </h3>

              <!-- Add Comment -->
              <div class="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 class="font-bold text-gray-900 mb-4">Add a Comment</h4>
                <textarea 
                  v-model="newComment"
                  placeholder="Share your thoughts..."
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                ></textarea>
                <div class="flex justify-end">
                  <button 
                    @click="addComment"
                    :disabled="!newComment.trim()"
                    class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              <!-- Comments List -->
              <div class="space-y-6">
                <div 
                  v-for="comment in selectedPost.comments" 
                  :key="comment.id"
                  class="border-b border-gray-100 pb-6 last:border-0"
                >
                  <div class="flex items-start">
                    <img 
                      :src="comment.author.avatar" 
                      :alt="comment.author.name"
                      class="w-10 h-10 rounded-full mr-4"
                    />
                    <div class="flex-1">
                      <div class="mb-2">
                        <p class="font-bold text-gray-900">{{ comment.author.name }}</p>
                        <p class="text-gray-500 text-sm">{{ comment.time }}</p>
                      </div>
                      <p class="text-gray-700">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock user data (replace with real auth)
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'user@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
})

// State
const categoryFilter = ref('')
const email = ref('')
const newComment = ref('')
const selectedPost = ref(null)
const visiblePosts = ref(4)

// Categories
const categories = ref([
  { id: 'market-trends', name: 'Market Trends', count: 8 },
  { id: 'investment', name: 'Investment Tips', count: 12 },
  { id: 'property-valuation', name: 'Property Valuation', count: 6 },
  { id: 'legal', name: 'Legal Insights', count: 4 },
  { id: 'company', name: 'Company Updates', count: 3 }
])

// Mock Blog Posts
const posts = ref([
  {
    id: 1,
    title: 'Understanding Property Valuation in Nigeria: A Comprehensive Guide',
    excerpt: 'Learn how property valuation works in Nigeria and what factors influence property prices in different regions.',
    content: 'Property valuation in Nigeria is influenced by various factors including location, infrastructure, market demand, and economic conditions. In this guide, we explore the key elements that determine property values across different Nigerian cities, from Lagos to Abuja.',
    category: 'property-valuation',
    categoryLabel: 'Property Valuation',
    date: '2 days ago',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: {
      id: 1,
      name: 'Michael Adebayo',
      role: 'Senior Property Valuer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
    },
    comments: [
      {
        id: 1,
        content: 'This is very insightful! Can you elaborate more on Lagos property trends?',
        author: {
          id: 2,
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
        },
        time: '1 hour ago'
      },
      {
        id: 2,
        content: 'Great article! I found the section on infrastructure particularly helpful.',
        author: {
          id: 3,
          name: 'David Okoro',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
        },
        time: '3 hours ago'
      }
    ]
  },
  {
    id: 2,
    title: '2024 Real Estate Market Trends in Lagos',
    excerpt: 'Analysis of the current real estate market in Lagos and predictions for the coming year.',
    content: 'The Lagos real estate market is showing interesting trends in 2024, with significant growth in certain areas like Lekki Phase 2 and Epe. This article analyzes the factors driving these trends and what investors should watch out for.',
    category: 'market-trends',
    categoryLabel: 'Market Trends',
    date: '1 week ago',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: {
      id: 2,
      name: 'Chinwe Okonkwo',
      role: 'Market Analyst',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chinwe'
    },
    comments: [
      {
        id: 3,
        content: 'Very accurate analysis! The Lekki area is indeed booming.',
        author: {
          id: 4,
          name: 'James Okeke',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james'
        },
        time: '2 days ago'
      }
    ]
  },
  {
    id: 3,
    title: 'Top 5 Property Investment Tips for Beginners',
    excerpt: 'Essential advice for first-time property investors in Nigeria.',
    content: 'Starting your property investment journey can be daunting. Here are 5 essential tips: 1) Start with thorough research, 2) Consider location carefully, 3) Understand financing options, 4) Work with professionals, 5) Think long-term.',
    category: 'investment',
    categoryLabel: 'Investment Tips',
    date: '2 weeks ago',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: {
      id: 1,
      name: 'Michael Adebayo',
      role: 'Senior Property Valuer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
    },
    comments: []
  },
  {
    id: 4,
    title: 'Legal Aspects of Property Ownership in Nigeria',
    excerpt: 'Understanding the legal framework for property ownership and transfer.',
    content: 'Property ownership in Nigeria involves several legal considerations including proper documentation, land registration, and understanding property rights. This guide explains the essential legal requirements every property owner should know.',
    category: 'legal',
    categoryLabel: 'Legal Insights',
    date: '3 weeks ago',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: {
      id: 3,
      name: 'Grace Bello',
      role: 'Legal Consultant',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace'
    },
    comments: [
      {
        id: 4,
        content: 'This clarified many legal questions I had. Thank you!',
        author: {
          id: 5,
          name: 'Amina Yusuf',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amina'
        },
        time: '1 week ago'
      }
    ]
  },
  {
    id: 5,
    title: 'New Office Opening in Abuja',
    excerpt: 'We are excited to announce the opening of our new Abuja office.',
    content: 'To better serve our clients in the Federal Capital Territory, we have opened a new office in the Central Business District of Abuja. This expansion allows us to provide more comprehensive property valuation services across Northern Nigeria.',
    category: 'company',
    categoryLabel: 'Company Updates',
    date: '1 month ago',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: {
      id: 4,
      name: 'Samuel Eze',
      role: 'CEO',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=samuel'
    },
    comments: [
      {
        id: 5,
        content: 'Congratulations on the expansion! Looking forward to visiting.',
        author: {
          id: 6,
          name: 'Blessing Adeleke',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blessing'
        },
        time: '3 weeks ago'
      }
    ]
  }
])

// Featured post is the first one
const featuredPost = computed(() => posts.value[0])

// Filtered posts
const filteredPosts = computed(() => {
  let filtered = posts.value.slice(1) // Exclude featured post
  
  if (categoryFilter.value) {
    filtered = filtered.filter(post => post.category === categoryFilter.value)
  }
  
  return filtered.slice(0, visiblePosts.value)
})

// Recent comments from all posts
const recentComments = computed(() => {
  const allComments = []
  posts.value.forEach(post => {
    post.comments.forEach(comment => {
      allComments.push({
        ...comment,
        postTitle: post.title
      })
    })
  })
  return allComments.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
})

// Methods
const getCategoryClass = (category) => {
  const classes = {
    'market-trends': 'bg-green-100 text-green-800',
    'investment': 'bg-purple-100 text-purple-800',
    'property-valuation': 'bg-blue-100 text-blue-800',
    'legal': 'bg-yellow-100 text-yellow-800',
    'company': 'bg-red-100 text-red-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const viewPost = (postId) => {
  selectedPost.value = posts.value.find(post => post.id === postId)
}

const addComment = () => {
  if (!newComment.value.trim() || !selectedPost.value) return
  
  const comment = {
    id: Date.now(),
    content: newComment.value,
    author: {
      id: user.value.id,
      name: user.value.name,
      avatar: user.value.avatar
    },
    time: 'Just now'
  }
  
  selectedPost.value.comments.unshift(comment)
  newComment.value = ''
}

const loadMorePosts = () => {
  visiblePosts.value += 2
}

const subscribeNewsletter = () => {
  if (email.value) {
    alert(`Thank you for subscribing with ${email.value}!`)
    email.value = ''
  }
}

// Initialize with mock comments for featured post
onMounted(() => {
  // Ensure featured post has comments
  if (posts.value[0] && posts.value[0].comments.length === 0) {
    posts.value[0].comments = [
      {
        id: 6,
        content: 'Excellent insights! Looking forward to more articles like this.',
        author: {
          id: 7,
          name: 'Funke Adebayo',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=funke'
        },
        time: '1 day ago'
      }
    ]
  }
})
</script>

<style scoped>
/* Custom styles for better visual hierarchy */
.prose {
  line-height: 1.6;
}

.prose p {
  margin-bottom: 1.5rem;
}

/* Smooth transitions */
* {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>