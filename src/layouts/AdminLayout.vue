<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AdminSidebar } from '@/components/layout'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <main class="ml-64 min-h-screen">
      <div class="p-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

