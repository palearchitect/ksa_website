<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-transparent text-slate-900">
      <!-- Hero Header -->
      <div class="relative bg-gradient-to-b from-[#030810] via-[#071328] to-[#0a1835] text-white pt-28 md:pt-36 pb-16 overflow-hidden border-b border-white/10">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.25),rgba(249,104,22,0.1)_50%,transparent_80%)] pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Market Intelligence & Reports
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Property Insights & <span class="text-gradient-brand">Market Trends</span>
          </h1>
          <p class="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Data-backed valuation analyses, investment intelligence, and regulatory updates from certified estate surveyors.
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Category Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            @click="categoryFilter = ''"
            :class="[
              'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap',
              categoryFilter === ''
                ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
            ]"
          >
            All Perspectives
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="categoryFilter = cat.id"
            :class="[
              'px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2',
              categoryFilter === cat.id
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-glow-orange'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
            ]"
          >
            <span>{{ cat.name }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-bold">{{ cat.count }}</span>
          </button>
        </div>

        <div class="grid lg:grid-cols-12 gap-8 items-start">
          <!-- Main Blog Section (8 cols) -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Featured Post (Bento Masterpiece) -->
            <div 
              v-if="featuredPost" 
              class="bento-card overflow-hidden bg-white border border-slate-200/80 rounded-3xl shadow-xl group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              @click="viewPost(featuredPost.id)"
            >
              <div class="grid md:grid-cols-12">
                <div class="md:col-span-6 relative h-64 md:h-auto overflow-hidden bg-slate-100">
                  <img 
                    :src="featuredPost.image" 
                    :alt="featuredPost.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>
                  <span class="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-md">
                    Featured Analysis
                  </span>
                </div>
                <div class="md:col-span-6 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span>{{ featuredPost.date }}</span>
                      <span>•</span>
                      <span>{{ featuredPost.readTime }}</span>
                    </div>
                    <h2 class="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-3 group-hover:text-blue-700 transition-colors">
                      {{ featuredPost.title }}
                    </h2>
                    <p class="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                      {{ featuredPost.excerpt }}
                    </p>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div class="flex items-center gap-3">
                      <img 
                        :src="featuredPost.author.avatar" 
                        :alt="featuredPost.author.name"
                        class="w-9 h-9 rounded-full border border-slate-200"
                      />
                      <div>
                        <p class="font-bold text-slate-900 text-xs">{{ featuredPost.author.name }}</p>
                        <p class="text-[11px] text-slate-500">{{ featuredPost.author.role }}</p>
                      </div>
                    </div>
                    <span class="inline-flex items-center text-xs font-bold text-blue-700 group-hover:text-orange-600 transition-colors">
                      Read Report →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Articles Bento Grid -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                  Recent Briefs & Publications
                </h2>
              </div>

              <div class="grid sm:grid-cols-2 gap-6">
                <div 
                  v-for="post in filteredPosts" 
                  :key="post.id"
                  @click="viewPost(post.id)"
                  class="bento-card bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div class="relative h-48 overflow-hidden bg-slate-100">
                    <img 
                      :src="post.image" 
                      :alt="post.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span class="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 shadow">
                      {{ post.categoryLabel }}
                    </span>
                  </div>
                  <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <span>{{ post.date }}</span>
                        <span>•</span>
                        <span>{{ post.readTime }}</span>
                      </div>
                      <h3 class="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition line-clamp-2">
                        {{ post.title }}
                      </h3>
                      <p class="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                        {{ post.excerpt }}
                      </p>
                    </div>
                    <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div class="flex items-center gap-2">
                        <img :src="post.author.avatar" class="w-6 h-6 rounded-full" alt="" />
                        <span class="font-medium text-slate-700 text-[11px]">{{ post.author.name }}</span>
                      </div>
                      <span class="font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Load More Button -->
              <div v-if="visiblePosts < posts.length" class="text-center mt-8">
                <button 
                  @click="loadMorePosts"
                  class="px-8 py-3 rounded-full border border-slate-300 hover:border-blue-600 bg-white hover:bg-blue-50/50 text-slate-800 hover:text-blue-700 font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  Load Additional Articles
                </button>
              </div>
            </div>
          </div>

          <!-- Sidebar (4 cols) -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Newsletter Signup (Luxury Bento Dark Card) -->
            <div class="bento-card p-6 md:p-8 bg-gradient-to-br from-[#030810] via-[#081734] to-[#040a17] text-white border border-white/15 rounded-3xl shadow-xl relative overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-36 h-36 bg-orange-500/15 rounded-full blur-xl pointer-events-none"></div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/15">
                Valuer Dispatch
              </div>
              <h3 class="text-xl font-extrabold text-white mb-2 tracking-tight">Stay Market-Informed</h3>
              <p class="text-slate-300 text-xs leading-relaxed mb-5">
                Join 2,400+ developers, financial institutions, and private investors receiving our bi-weekly Nigerian real estate intelligence.
              </p>
              <div class="space-y-3">
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="Enter corporate email..."
                  class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button 
                  @click="subscribeNewsletter"
                  class="w-full py-3 px-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-glow-orange transition-all duration-200"
                >
                  Subscribe to Dispatch
                </button>
              </div>
              <p class="text-[10px] text-slate-400 text-center mt-3">
                Strictly zero spam. Unsubscribe anytime.
              </p>
            </div>

            <!-- Recent Comments Bento Tile -->
            <div class="bento-card p-6 bg-white border border-slate-200/80 rounded-3xl shadow-lg">
              <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <span class="w-1.5 h-3.5 bg-blue-600 rounded-full"></span>
                Community Inquiries
              </h3>
              <div class="space-y-4">
                <div 
                  v-for="comment in recentComments" 
                  :key="comment.id"
                  class="border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <div class="flex items-start gap-3">
                    <img 
                      :src="comment.author.avatar" 
                      :alt="comment.author.name"
                      class="w-7 h-7 rounded-full border border-slate-200 mt-0.5"
                    />
                    <div>
                      <p class="font-bold text-slate-900 text-xs">{{ comment.author.name }}</p>
                      <p class="text-slate-600 text-xs mt-0.5 leading-snug">"{{ comment.content.substring(0, 65) }}..."</p>
                      <p class="text-[10px] text-slate-400 mt-1">{{ comment.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
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
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'
useSEO({
  title: 'Blog - Property Insights & Updates',
  description: 'Stay informed with the latest property market trends, investment tips, and company updates from Nigeria’s premier property valuers.'
})
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