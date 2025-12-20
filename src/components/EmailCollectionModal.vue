<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-container" @click.stop>
          <button class="modal-close" @click="closeModal" aria-label="Close">✕</button>
          
          <div class="modal-content">
            <div class="modal-icon">📧</div>
            <h2 class="modal-title">Track Your Whole Season</h2>
            <p class="modal-subtitle">Get notified when season tracking is available</p>

            <form @submit.prevent="handleSubmit" class="email-form">
              <div class="input-wrapper">
                <input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  class="email-input"
                  :class="{ error: errorMessage }"
                  :disabled="isSubmitting || isSuccess"
                  required
                />
              </div>

              <button
                type="submit"
                class="submit-btn"
                :class="{ loading: isSubmitting, success: isSuccess }"
                :disabled="isSubmitting || isSuccess"
              >
                <span v-if="isSubmitting">Submitting...</span>
                <span v-else-if="isSuccess">✓ Registered!</span>
                <span v-else>Notify Me</span>
              </button>

              <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
              <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            </form>

            <p class="privacy-note">We'll only use your email to notify you about season tracking. No spam, ever.</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { submitEmail } from '@/services/emailService'

interface Props {
  isOpen: boolean
  athleteId?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const email = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    email.value = ''
    errorMessage.value = ''
    successMessage.value = ''
    isSuccess.value = false
  }
})

async function handleSubmit() {
  if (isSubmitting.value || isSuccess.value) return

  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    const result = await submitEmail(email.value, props.athleteId)

    if (result.success) {
      isSuccess.value = true
      successMessage.value = result.message || 'You\'re all set! We\'ll notify you when season tracking is ready.'
      
      // Close modal after 2 seconds
      setTimeout(() => {
        closeModal()
      }, 2000)
    } else {
      errorMessage.value = result.error || 'Something went wrong. Please try again.'
    }
  } catch (error) {
    errorMessage.value = 'Network error. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
  }
}

function closeModal() {
  emit('close')
}

function handleBackdropClick() {
  if (!isSubmitting.value) {
    closeModal()
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--spacing-md);
}

.modal-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid rgba(204, 255, 0, 0.3);
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 0 40px rgba(204, 255, 0, 0.2);
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.modal-close:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.modal-content {
  padding: var(--spacing-2xl);
  text-align: center;
}

.modal-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  filter: drop-shadow(0 0 10px rgba(204, 255, 0, 0.3));
}

.modal-title {
  font-family: var(--font-family-heading);
  font-size: 2rem;
  color: var(--color-accent-primary);
  margin: 0 0 var(--spacing-sm) 0;
  text-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-subtitle {
  font-family: var(--font-family-base);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 var(--spacing-xl) 0;
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-wrapper {
  position: relative;
}

.email-input {
  width: 100%;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-family: var(--font-family-base);
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.email-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.email-input.error {
  border-color: var(--color-accent-secondary);
}

.email-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.submit-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-accent-primary);
  color: black;
  border: none;
  border-radius: 8px;
  font-family: var(--font-family-heading);
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: #e0ff33;
  box-shadow: 0 0 30px rgba(204, 255, 0, 0.5);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn.loading {
  background: rgba(204, 255, 0, 0.5);
}

.submit-btn.success {
  background: #00ff9d;
  box-shadow: 0 0 20px rgba(0, 255, 157, 0.3);
}

.error-message {
  color: var(--color-accent-secondary);
  font-size: 0.9rem;
  margin: 0;
  font-family: var(--font-family-base);
}

.success-message {
  color: #00ff9d;
  font-size: 0.9rem;
  margin: 0;
  font-family: var(--font-family-base);
  font-weight: 600;
}

.privacy-note {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: var(--spacing-lg) 0 0 0;
  font-family: var(--font-family-base);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    padding: var(--spacing-xl);
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-subtitle {
    font-size: 0.9rem;
  }

  .email-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>
