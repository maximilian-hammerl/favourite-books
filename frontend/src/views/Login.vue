<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'

const emailAddress = ref<string>('')
const password = ref<string>('')

async function login() {
  await supabase.auth.signInWithPassword({
    email: emailAddress.value,
    password: password.value,
  })
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-2">
      <div>
        <label for="email-address">E-mail address</label>
        <VoltInputText id="email-address" v-model="emailAddress" fluid />
      </div>
      <div>
        <label for="password">Password</label>
        <VoltInputText id="password" v-model="password" type="password" fluid />
      </div>

      <VoltButton label="Login" @click="login()" />
    </div>
  </div>
</template>
