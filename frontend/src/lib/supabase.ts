import { createClient, type User } from '@supabase/supabase-js'
import type { Database } from '@/gen/database'
import router from '@/router'
import { ref } from 'vue'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)

export const user = ref<User>()

supabase.auth.onAuthStateChange((event, session) => {
  user.value = session?.user

  switch (event) {
    case 'SIGNED_IN':
      console.info('Forwarding to books on sign in')
      void router.push({ name: 'books' })
      break

    case 'SIGNED_OUT':
      console.info('Forwarding to login on sign out')
      void router.push({ name: 'login' })
      break

    default:
      console.debug('Ignoring auth event', event)
  }
})
