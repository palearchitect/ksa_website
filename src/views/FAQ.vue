<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-blue-900 to-blue-800">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p class="text-xl text-blue-100 max-w-3xl mx-auto">
            Find answers to the most common questions about our services, processes, and professional approach to property valuation and management.
          </p>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div class="bg-white rounded-xl shadow-lg p-4">
        <div class="relative">
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for questions or topics..."
            class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            @input="handleSearch"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="searchQuery" class="mt-3 text-sm text-gray-600">
          <span class="font-medium">{{ filteredFAQs.length }}</span> results found
          <button 
            @click="clearSearch"
            class="ml-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear search
          </button>
        </div>
      </div>
    </div>

    <!-- AI Assistant Button -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-right">
      <button
        @click="showAIPanel = !showAIPanel"
        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {{ showAIPanel ? 'Hide AI Assistant' : 'Ask AI Assistant' }}
      </button>
    </div>

    <!-- AI Assistant Panel -->
    <div v-if="showAIPanel" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">AI Assistant</h3>
              <p class="text-sm text-gray-600">Powered by AI • 24/7 Support</p>
            </div>
          </div>
          <button @click="showAIPanel = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="unansweredQuestion" class="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <p class="text-sm text-gray-500">Your question:</p>
          <p class="text-gray-800 font-medium">"{{ unansweredQuestion }}"</p>
        </div>
        
        <div class="bg-white rounded-lg p-4 min-h-[100px]">
          <div v-if="isAILoading" class="flex items-center justify-center h-20">
            <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div v-else>
            <p class="text-gray-700">{{ aiAnswer || "👋 Hello! I'm your AI assistant. Ask me anything about KSA Valuers, property valuation, or our services!" }}</p>
          </div>
        </div>
        
        <div class="mt-4 flex gap-2">
          <input
            v-model="userQuestion"
            @keyup.enter="askAI"
            type="text"
            placeholder="Type your question here..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            @click="askAI"
            :disabled="isAILoading || !userQuestion.trim()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Ask
          </button>
        </div>
        
        <!-- Suggested Questions -->
        <div class="mt-4">
          <p class="text-xs text-gray-500 mb-2">Try asking:</p>
          <div class="flex flex-wrap gap-2">
            <button
              @click="askSuggestedQuestion('How much does property valuation cost?')"
              class="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              💰 Valuation costs
            </button>
            <button
              @click="askSuggestedQuestion('What documents do I need for property valuation?')"
              class="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              📄 Required documents
            </button>
            <button
              @click="askSuggestedQuestion('How long does property valuation take?')"
              class="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              ⏱️ Processing time
            </button>
            <button
              @click="askSuggestedQuestion('Do you serve clients outside Lagos?')"
              class="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              🗺️ Service areas
            </button>
          </div>
        </div>
        
        <p class="text-xs text-gray-500 mt-3">
          AI responses are generated automatically. For complex matters, please contact our team directly.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Categories Navigation -->
      <div class="mb-12">
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            {{ category.name }}
            <span v-if="category.id !== 'all'" class="ml-1 text-xs opacity-75">
              ({{ getCategoryCount(category.id) }})
            </span>
          </button>
        </div>
      </div>

      <!-- FAQ Sections -->
      <div v-if="filteredFAQs.length > 0" class="space-y-8">
        <!-- Search Results Header -->
        <div v-if="searchQuery" class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Search Results for "{{ searchQuery }}"
          </h2>
          <p class="text-gray-600">
            Found {{ filteredFAQs.length }} matching questions
          </p>
        </div>

        <!-- General Company Information -->
        <div v-if="showCategory('general')" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 border-b border-blue-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">General Company Information</h2>
                <p class="text-gray-600">Learn about our company, services, and professional standards</p>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div 
              v-for="faq in getFAQsByCategory('general')" 
              :key="faq.id"
              class="faq-item"
            >
              <button
                @click="toggleFAQ(faq.id)"
                class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span class="text-blue-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900" v-html="highlightSearchTerms(faq.question)"></h3>
                  </div>
                </div>
                <svg 
                  class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200" 
                  :class="{ 'rotate-180': openFAQs.includes(faq.id) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                v-show="openFAQs.includes(faq.id)"
                class="px-8 pb-6"
              >
                <div class="pl-12 pr-4">
                  <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <p class="text-gray-700" v-html="highlightSearchTerms(faq.answer)"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Property Management -->
        <div v-if="showCategory('property')" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-green-50 to-green-100 px-8 py-6 border-b border-green-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Property Management</h2>
                <p class="text-gray-600">Questions about lease management, tenant relations, and property maintenance</p>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div 
              v-for="faq in getFAQsByCategory('property')" 
              :key="faq.id"
              class="faq-item"
            >
              <button
                @click="toggleFAQ(faq.id)"
                class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span class="text-green-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900" v-html="highlightSearchTerms(faq.question)"></h3>
                  </div>
                </div>
                <svg 
                  class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200" 
                  :class="{ 'rotate-180': openFAQs.includes(faq.id) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                v-show="openFAQs.includes(faq.id)"
                class="px-8 pb-6"
              >
                <div class="pl-12 pr-4">
                  <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                    <p class="text-gray-700" v-html="highlightSearchTerms(faq.answer)"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Valuation & Sales -->
        <div v-if="showCategory('valuation')" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-8 py-6 border-b border-purple-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Valuation & Sales</h2>
                <p class="text-gray-600">Questions about property valuation, pricing, and sales processes</p>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div 
              v-for="faq in getFAQsByCategory('valuation')" 
              :key="faq.id"
              class="faq-item"
            >
              <button
                @click="toggleFAQ(faq.id)"
                class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span class="text-purple-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900" v-html="highlightSearchTerms(faq.question)"></h3>
                  </div>
                </div>
                <svg 
                  class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200" 
                  :class="{ 'rotate-180': openFAQs.includes(faq.id) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                v-show="openFAQs.includes(faq.id)"
                class="px-8 pb-6"
              >
                <div class="pl-12 pr-4">
                  <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <p class="text-gray-700" v-html="highlightSearchTerms(faq.answer)"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Support -->
        <div v-if="showCategory('support')" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 px-8 py-6 border-b border-orange-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Client Support</h2>
                <p class="text-gray-600">Questions about contacting our team and getting assistance</p>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div 
              v-for="faq in getFAQsByCategory('support')" 
              :key="faq.id"
              class="faq-item"
            >
              <button
                @click="toggleFAQ(faq.id)"
                class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span class="text-orange-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900" v-html="highlightSearchTerms(faq.question)"></h3>
                  </div>
                </div>
                <svg 
                  class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200" 
                  :class="{ 'rotate-180': openFAQs.includes(faq.id) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                v-show="openFAQs.includes(faq.id)"
                class="px-8 pb-6"
              >
                <div class="pl-12 pr-4">
                  <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <p class="text-gray-700" v-html="highlightSearchTerms(faq.answer)"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legal & Documentation -->
        <div v-if="showCategory('legal')" class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-red-50 to-red-100 px-8 py-6 border-b border-red-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Legal & Documentation</h2>
                <p class="text-gray-600">Questions about legal requirements, contracts, and documentation</p>
              </div>
            </div>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div 
              v-for="faq in getFAQsByCategory('legal')" 
              :key="faq.id"
              class="faq-item"
            >
              <button
                @click="toggleFAQ(faq.id)"
                class="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <span class="text-red-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900" v-html="highlightSearchTerms(faq.question)"></h3>
                  </div>
                </div>
                <svg 
                  class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200" 
                  :class="{ 'rotate-180': openFAQs.includes(faq.id) }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                v-show="openFAQs.includes(faq.id)"
                class="px-8 pb-6"
              >
                <div class="pl-12 pr-4">
                  <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                    <p class="text-gray-700" v-html="highlightSearchTerms(faq.answer)"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message with AI Option -->
      <div v-else class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">No questions found</h3>
        <p class="text-gray-600 max-w-md mx-auto mb-4">
          We couldn't find any questions matching "{{ searchQuery }}". 
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="askAIWithQuery(searchQuery)"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors duration-200"
          >
            Ask AI Assistant Instead
          </button>
          <button
            @click="clearSearch"
            class="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Clear Search
          </button>
        </div>
      </div>

      <!-- CTA Section -->
      <div v-if="filteredFAQs.length > 0" class="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-12 text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold text-white mb-4">Still have questions?</h2>
          <p class="text-blue-100 text-lg mb-8">
            Can't find what you're looking for? Our team is ready to provide personalized answers and expert advice for your specific situation.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/contact-us"
              class="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </router-link>
            <a
              href="tel:+2349053901001"
              class="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us Now
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="filteredFAQs.length > 5" class="mt-8 flex justify-between items-center">
        <button
          @click="openAllFAQs"
          class="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Expand All
        </button>
        <button
          @click="closeAllFAQs"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
          Collapse All
        </button>
      </div>
    </div>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from '../components/global/ErrorBoundary.vue'
import { useSEO } from '../hooks/useSEO'
useSEO({
  title: 'FAQ - Frequently Asked Questions',
  description: 'Find answers to the most common questions about our services, processes, and professional approach to property valuation and management.'
})
import { ref, computed, watch } from 'vue'

// API Configuration - Update this with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// State
const searchQuery = ref('')
const activeCategory = ref('all')
const openFAQs = ref([])

// AI State
const showAIPanel = ref(false)
const userQuestion = ref('')
const aiAnswer = ref('')
const isAILoading = ref(false)
const unansweredQuestion = ref('')

// Categories
const categories = ref([
  { id: 'all', name: 'All Questions' },
  { id: 'general', name: 'General' },
  { id: 'property', name: 'Property Management' },
  { id: 'valuation', name: 'Valuation & Sales' },
  { id: 'support', name: 'Client Support' },
  { id: 'legal', name: 'Legal & Documentation' }
])

// FAQ Data 
const faqs = ref([
  // General Company Information
  {
    id: 1,
    category: 'general',
    question: 'Who are Kayode Segun & Associates (KSA Valuers)?',
    answer: 'KSA Valuers is a premier property valuation and real estate consulting firm in Nigeria. We serve as professional intermediaries between property owners and tenants, specializing in property valuation, estate management, lease renewals, and sales agency services. Our team consists of certified estate surveyors and valuers with extensive industry experience.'
  },
  {
    id: 2,
    category: 'general',
    question: 'What services do you provide?',
    answer: 'We offer comprehensive property solutions including: 1) Property Valuation & Appraisal, 2) Estate Management & Administration, 3) Lease Renewal & Rent Collection, 4) Property Sales & Agency, 5) Construction Cost Consulting, 6) Property Investment Advisory, 7) Tenancy Agreement Documentation, and 8) Property Market Research.'
  },
  {
    id: 3,
    category: 'general',
    question: 'Are your valuers professionally certified?',
    answer: 'Yes, all our valuers are certified members of the Nigerian Institution of Estate Surveyors and Valuers (NIESV). Our team includes Estate Surveyors and Valuers (ESV) with valid practicing licenses, ensuring compliance with professional standards and regulations.'
  },
  {
    id: 4,
    category: 'general',
    question: 'Which areas in Nigeria do you serve?',
    answer: 'While our main office is in Lagos, we provide services across Nigeria including Abuja, Port Harcourt, Ibadan, and other major cities. We have a network of professional partners that enables us to serve clients nationwide with consistent quality and professionalism.'
  },

  // Property Management
  {
    id: 5,
    category: 'property',
    question: 'How do you handle lease renewals?',
    answer: 'We proactively monitor lease expiration dates and initiate renewal discussions 3-4 months before expiry. We conduct market research to determine current rental rates, negotiate favorable terms for our clients, prepare renewal documentation, and ensure all parties comply with the renewed agreement.'
  },
  {
    id: 6,
    category: 'property',
    question: 'What happens if tenants default on payments?',
    answer: 'We implement a structured approach: 1) Immediate communication with the tenant, 2) Formal demand notice issuance, 3) Mediation and payment plan negotiation, 4) Legal proceedings if necessary, and 5) Tenant replacement as a last resort. We maintain strict compliance with tenancy laws throughout the process.'
  },
  {
    id: 7,
    category: 'property',
    question: 'Do you handle property maintenance and repairs?',
    answer: 'Yes, we coordinate all aspects of property maintenance including regular inspections, obtaining repair quotes, supervising contractors, and ensuring quality workmanship. We maintain a network of trusted service providers and manage repair budgets efficiently.'
  },
  {
    id: 8,
    category: 'property',
    question: 'How do you ensure tenant quality and reliability?',
    answer: 'We conduct comprehensive tenant screening including employment verification, credit checks, previous landlord references, and personal interviews. Our rigorous vetting process minimizes risk and ensures we select responsible tenants who will maintain the property properly and pay rent consistently.'
  },

  // Valuation & Sales
  {
    id: 9,
    category: 'valuation',
    question: 'Do you provide official valuation reports?',
    answer: 'Yes, we provide professionally prepared valuation reports that are accepted by banks, government agencies, and courts. Our reports include detailed property analysis, comparable market data, valuation methodology explanation, and certified valuer signatures.'
  },
  {
    id: 10,
    category: 'valuation',
    question: 'How do you determine property value?',
    answer: 'We use multiple valuation methods including comparative analysis, income capitalization, and cost approach. Factors considered include location, property condition, market trends, infrastructure development, comparable sales data, and economic indicators. Our valuations follow international standards and Nigerian regulatory requirements.'
  },
  {
    id: 11,
    category: 'valuation',
    question: 'How long does the valuation process take?',
    answer: 'Standard residential valuations are completed within 3-5 business days after property inspection. Commercial and industrial properties may require 7-10 business days due to complexity. Emergency valuations with expedited service are available at an additional cost.'
  },
  {
    id: 12,
    category: 'valuation',
    question: 'What documents do I need for property valuation?',
    answer: 'Required documents include: 1) Proof of ownership (Title/C of O), 2) Recent utility bills, 3) Survey plan, 4) Building approval plans, 5) Recent photographs, 6) Tenancy agreements (if rented), and 7) Any previous valuation reports. We can advise on specific requirements based on property type.'
  },

  // Client Support
  {
    id: 13,
    category: 'support',
    question: 'How can I contact your team?',
    answer: 'You can reach us through: Phone: +234 905 390 1001 / 08184796032, Email: kayodesegunandassociates@gmail.com, Office: Suite J260, Road 5, Ikota Shopping Complex, Ajah, Lekki, Lagos. We also offer online contact forms on our website and live chat support during business hours.'
  },
  {
    id: 14,
    category: 'support',
    question: 'Do you offer consultation before engagement?',
    answer: 'Yes, we provide free initial consultations to understand your needs and explain our services. During this consultation, we assess your property situation, answer your questions, and provide preliminary advice without any obligation to engage our services.'
  },
  {
    id: 15,
    category: 'support',
    question: 'What are your business hours?',
    answer: 'Our office hours are Monday to Friday: 8:00 AM to 6:00 PM, Saturday: 9:00 AM to 2:00 PM. Emergency services are available outside these hours for urgent matters. Online inquiries via our website are monitored 24/7.'
  },
  {
    id: 16,
    category: 'support',
    question: 'How quickly do you respond to inquiries?',
    answer: 'We aim to respond to all inquiries within 2 business hours during office hours. Email queries receive responses within 24 hours. Urgent matters can be addressed immediately through our phone lines. We pride ourselves on prompt and professional communication.'
  },

  // Legal & Documentation
  {
    id: 17,
    category: 'legal',
    question: 'Are your tenancy agreements legally binding?',
    answer: 'Yes, all our tenancy agreements are prepared by legal professionals and comply with Nigerian tenancy laws. They include all necessary clauses to protect both landlord and tenant rights, and are regularly updated to reflect current legislation and court rulings.'
  },
  {
    id: 18,
    category: 'legal',
    question: 'Do you handle property title verification?',
    answer: 'Yes, we conduct thorough title searches and verification through appropriate government agencies to confirm property ownership and identify any encumbrances or legal issues. This service is crucial for property transactions to prevent future legal disputes.'
  },
  {
    id: 19,
    category: 'legal',
    question: 'What legal protection do you provide to clients?',
    answer: 'We maintain professional indemnity insurance and work closely with legal partners to ensure client protection. Our services include proper documentation, compliance with regulations, dispute resolution assistance, and legal representation when necessary through our network of legal professionals.'
  },
  {
    id: 20,
    category: 'legal',
    question: 'Can you help with property dispute resolution?',
    answer: 'Yes, we provide mediation and dispute resolution services for property-related conflicts including tenant-landlord disputes, boundary issues, ownership conflicts, and contract disagreements. We aim for amicable resolution but can recommend legal action when necessary.'
  }
])

// Methods
const toggleFAQ = (id) => {
  const index = openFAQs.value.indexOf(id)
  if (index > -1) {
    openFAQs.value.splice(index, 1)
  } else {
    openFAQs.value.push(id)
  }
}

const openAllFAQs = () => {
  openFAQs.value = faqs.value.map(faq => faq.id)
}

const closeAllFAQs = () => {
  openFAQs.value = []
}

const selectCategory = (categoryId) => {
  activeCategory.value = categoryId
  searchQuery.value = ''
}

const handleSearch = () => {
  if (searchQuery.value && activeCategory.value !== 'all') {
    activeCategory.value = 'all'
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const getCategoryCount = (categoryId) => {
  if (categoryId === 'all') return faqs.value.length
  return faqs.value.filter(faq => faq.category === categoryId).length
}

const showCategory = (categoryId) => {
  if (activeCategory.value === 'all') {
    return getFAQsByCategory(categoryId).length > 0
  }
  return activeCategory.value === categoryId
}

const getFAQsByCategory = (categoryId) => {
  let faqsInCategory = faqs.value.filter(faq => faq.category === categoryId)
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    faqsInCategory = faqsInCategory.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    )
  }
  
  return faqsInCategory
}

const highlightSearchTerms = (text) => {
  if (!searchQuery.value) return text
  
  const query = searchQuery.value.toLowerCase()
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 font-medium">$1</mark>')
}

// AI Functions - Updated to use your backend
const askAI = async () => {
  if (!userQuestion.value.trim()) return
  
  unansweredQuestion.value = userQuestion.value
  isAILoading.value = true
  showAIPanel.value = true
  
  try {
    // Call your backend API
    const response = await fetch(`${API_BASE_URL}/api/ask-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userQuestion.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      aiAnswer.value = data.answer
    } else {
      aiAnswer.value = data.message || "I couldn't generate an answer. Please try again or contact our team."
    }
    
  } catch (error) {
    console.error('AI Error:', error)
    
    // Better error messages based on connection status
    if (!navigator.onLine) {
      aiAnswer.value = "You're offline. Please check your internet connection and try again."
    } else {
      aiAnswer.value = "I'm having trouble connecting right now. Please try again or contact our team directly."
    }
  } finally {
    isAILoading.value = false
    userQuestion.value = ''
  }
}

const askAIWithQuery = (query) => {
  userQuestion.value = query
  showAIPanel.value = true // Ensure panel opens
  askAI()
}

const askSuggestedQuestion = (question) => {
  userQuestion.value = question
  showAIPanel.value = true // Ensure panel opens
  askAI()
}

// Computed Properties
const filteredFAQs = computed(() => {
  let filtered = faqs.value

  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === activeCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Watch for search
watch(searchQuery, (newQuery) => {
  if (newQuery && filteredFAQs.value.length > 0) {
    openFAQs.value = [filteredFAQs.value[0].id]
  }
})
</script>

<style scoped>
/* Smooth transitions */
* {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
}

/* FAQ Item Hover Effects */
.faq-item:hover {
  background-color: #f9fafb;
}

/* Search input focus */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Category button hover */
button:hover {
  transform: translateY(-1px);
}

/* Rotate animation for FAQ arrows */
.rotate-180 {
  transform: rotate(180deg);
}

/* Mark/highlight styles */
mark {
  padding: 0.1rem 0.2rem;
  border-radius: 0.25rem;
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
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive design adjustments */
@media (max-width: 640px) {
  .faq-item button {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .faq-item .pl-12 {
    padding-left: 4rem;
  }
}

/* AI Panel animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>