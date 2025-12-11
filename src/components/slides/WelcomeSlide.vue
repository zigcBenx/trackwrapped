<template>
  <SlideWrapper 
    background="linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
    type="welcome"
  >
    <AthleteHero
      :first-name="firstName"
      :last-name="lastName"
      :discipline-category="stats?.disciplineCategory || 'sprint'"
      :total-competitions="stats?.totalCompetitions || 0"
      :years-active="stats?.yearsActive || 0"
      :nickname="nickname"
    />
  </SlideWrapper>
</template>

<script setup lang="ts">
import SlideWrapper from './SlideWrapper.vue'
import AthleteHero from '../visuals/AthleteHero.vue'
import type { ProcessedAthleteStats } from '@/types/athleteDetails'

interface Props {
  firstName: string
  lastName: string
  stats: ProcessedAthleteStats
  nickname: string
}

defineProps<Props>()
</script>
