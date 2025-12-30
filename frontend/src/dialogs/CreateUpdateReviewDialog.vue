<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase, user } from '@/lib/supabase.ts'
import RatingWithIcons from '@/components/RatingWithIcons.vue'

const RATING_CONFIGURATIONS: Array<{
  rating: Extract<keyof Tables<'user_reviewed_book'>, `${string}_rating`>
  label: string
  helpText: { short: string; long: string }
  onIcon: string
  offIcon: string
}> = [
  {
    rating: 'overall_rating',
    label: 'Generelle Bewertung',
    helpText: {
      short: 'Wie gut war das Buch als Ganzes?',
      long: 'Musstest Du es abbrechen und weglegen, weil es so schlecht war, oder ist es eines Deiner absoluten Lieblingsbücher geworden?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'emotions_rating',
    label: 'Emotionalität',
    helpText: {
      short: 'Wie emotional war das Buch oder Szenen daraus?',
      long: 'Haben Dich die Probleme, Emotionen und Ereignisse komplett kalt gelassen, oder musstest Du jetzt noch anfangen zu weinen, wenn Du drüber nachdenkst?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'spice_rating',
    label: 'Spice',
    helpText: {
      short: 'Wie ausführlich sind spicy Scenen beschrieben?',
      long: 'Gab es gerade mal einen Kuss auf die Wange, oder musstest Du das Buch zuklappen, wenn jemand den Raum betreten hätte?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'darkness_rating',
    label: 'Darkness',
    helpText: {
      short: 'Wie düster, moralisch verwerflich oder befremdlich war das Buch?',
      long: 'Waren die Handlungen der Charaktere immer legal und moralisch, oder gab es Momente wo Du Dir dachtest "Holy Fuck..."',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'suspense_rating',
    label: 'Spannung',
    helpText: {
      short: 'Wie packend und mitreißend war die Story?',
      long: 'Musstest Du Dich von Wort zu Wort kämpfen, oder fast schon bremsen, um nicht Sätze zu überspringen?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'quality_of_writing_rating',
    label: 'Schreibstil',
    helpText: {
      short: 'Wie gut war das Buch geschrieben?',
      long: 'War das Buch eher einfach geschrieben, oder war der Schreibstil anspruchsvoll und facettenreich?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'plot_development_rating',
    label: 'Aufbau und Plot',
    helpText: {
      short: 'Wie gut waren der Handlungsablauf und die Plots und Plottwists?',
      long: 'Hast Du jede Handlung und jeden Satz vorhersehen können, oder haben manche Plottwists Dich Deine Denkkapazität hinterfragen lassen?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'characters_rating',
    label: 'Charaktere',
    helpText: {
      short: 'Wie überzeugend, nachvollziehbar und ausgearbeitet waren die Charaktere?',
      long: 'Waren die Charaktere tot langweilig, oder waren sie so gut ausgearbeitet, dass Du sie nie wieder vergessen wirst?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'ease_of_reading_rating',
    label: 'Leicht zu lesen',
    helpText: {
      short: 'War das Buch leicht zu verstehen und einfach zu lesen?',
      long: 'Musstest Du jedes Mal nachsehen, wie viel Seiten Du noch lesen musst, oder ist das Buch so verflogen, dass Du keine Ahnung hast, wie viele Stunden vergangen sind?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'story_immersion_rating',
    label: 'Eintauchen in die Story',
    helpText: {
      short: 'Wie einfach war es, in die Story abzutauchen?',
      long: 'Waren die Beschreibungen nur Worte auf dem Papier, oder bist Du während dem Lesen in Deiner Fantasie mit den Charakteren mitgelaufen und hast sehen können, was passiert ist?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
  {
    rating: 'ending_rating',
    label: 'Buchende',
    helpText: {
      short: 'Wie gelungen was der Schluss des Buchs?',
      long: 'War das Ende überhaput nicht zufriedenstellend und macht fast schon wütend und enttäuscht, oder hat es perfekt zur Story gepasst und Du hoffst, dass es noch mehr Teile gibt?',
    },
    onIcon: 'pi pi-star-fill text-primary-500',
    offIcon: 'pi pi-star',
  },
]

type Review = Omit<TablesInsert<'user_reviewed_book'>, 'user_id' | 'book_id'>

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  bookToReview: Tables<'book'> | null
}>()

const NEW_REVIEW: Review = {
  overall_rating: 0,
  emotions_rating: 0,
  spice_rating: 0,
  darkness_rating: 0,
  suspense_rating: 0,
  quality_of_writing_rating: 0,
  plot_development_rating: 0,
  characters_rating: 0,
  ease_of_reading_rating: 0,
  story_immersion_rating: 0,
  ending_rating: 0,
}

const review = ref<Review | null>(null)

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    if (props.bookToReview === null) {
      throw new Error('Book to review is required when creating a new review')
    }
    const { data: existingReview } = await supabase
      .from('user_reviewed_book')
      .select()
      .eq('user_id', user.value!.id)
      .eq('book_id', props.bookToReview.id)
      .maybeSingle()
      .throwOnError()

    review.value = existingReview ?? structuredClone(NEW_REVIEW)
  } else {
    review.value = null
  }
})

async function saveReview() {
  if (props.bookToReview === null) {
    throw new Error('Book to review is required when saving a review')
  }

  if (review.value === null) {
    throw new Error('Review cannot be null when saving')
  }

  await supabase
    .from('user_reviewed_book')
    .upsert({
      ...review.value,
      user_id: user.value!.id,
      book_id: props.bookToReview.id,
    })
    .throwOnError()
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    header="Buch-Review"
    modal
    :closable="false"
    class="min-w-11/12 sm:min-w-10/12 md:min-w-9/12 lg:min-w-8/12"
  >
    <form v-if="review" class="flex flex-col gap-4" @submit.prevent="saveReview()">
      <VoltFieldset
        v-for="ratingConfiguration in RATING_CONFIGURATIONS"
        :key="ratingConfiguration.rating"
      >
        <template #legend>
          <div>
            <div class="flex items-center gap-1 p-2">
              <i :class="ratingConfiguration.onIcon"></i>
              {{ ratingConfiguration.label }}
            </div>
          </div>
        </template>
        <RatingWithIcons
          :id="ratingConfiguration.rating"
          v-model="review[ratingConfiguration.rating]"
          :on-icon="ratingConfiguration.onIcon"
          :off-icon="ratingConfiguration.offIcon"
          :stars="10"
        />
        <VoltMessage size="small" severity="secondary" class="mt-4">
          <div>{{ ratingConfiguration.helpText.short }}</div>
          <div>{{ ratingConfiguration.helpText.long }}</div>
        </VoltMessage>
      </VoltFieldset>

      <VoltDivider />

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton label="Speichern" type="submit" />
      </div>
    </form>
  </VoltDialog>
</template>
