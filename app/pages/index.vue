<template>
  <div>
    <section class="dark relative isolate min-h-screen overflow-hidden text-ink">
      <NightScene class="-z-10" />
      <div class="mx-auto grid w-full max-w-6xl items-start gap-8 px-4 pt-24 pb-8 tablet:grid-cols-2 tablet:gap-12 tablet:px-6 tablet:pb-16">
        <div class="tablet:pt-16">
          <h1 class="heading-1 hero-heading max-w-hero" data-hero-heading>
            Know your GPA<br>
            and what it takes<br>
            to raise it
          </h1>
          <p class="body-3 mt-6 max-w-hero text-ink">
            GradeMate tracks every grade for university students on 4.0, 5.0, and UK scales, then shows the results you need to reach your target.
          </p>
          <NuxtLink to="/register" class="button button-primary mt-8" data-primary-action>
            Create your free account
            <PhArrowRight :size="16" weight="bold" aria-hidden="true" />
          </NuxtLink>
          <p class="caption-2 mt-4 text-ink">Free for every student. No credit card.</p>
        </div>
        <ProductPreview />
      </div>
    </section>

    <section id="features" ref="standSection" class="mx-auto grid max-w-6xl scroll-mt-24 items-center gap-12 px-6 py-24 tablet:grid-cols-2">
      <div>
        <h2 class="heading-2">Know where you stand</h2>
        <p class="body-3 mt-4 text-ink-soft">Your whole record in one place, and every figure stays correct as you add to it.</p>
        <ul class="mt-8 flex flex-col gap-4">
          <li v-for="item in standing" :key="item.title" class="flex gap-3">
            <component :is="item.icon" :size="24" class="shrink-0 text-accent-ink" aria-hidden="true" />
            <p class="body-6 text-ink-soft"><strong class="body-4 text-ink">{{ item.title }}.</strong> {{ item.detail }}</p>
          </li>
        </ul>
      </div>
      <div class="panel overflow-hidden" aria-hidden="true">
        <div class="flex items-center justify-between border-b border-line p-4">
          <span class="title-4">Year 2, second semester</span>
          <span class="tag tabular">3.77 GPA</span>
        </div>
        <table class="w-full">
          <tbody>
            <tr v-for="course in sampleCourses" :key="course.code" class="border-b border-line last:border-0">
              <td class="px-4 py-3">
                <span class="body-5 block">{{ course.name }}</span>
                <span class="caption-5 text-ink-muted">{{ course.code }}</span>
              </td>
              <td class="caption-2 tabular px-4 py-3 text-right text-ink-soft">{{ course.credits }} credits</td>
              <td class="body-4 tabular px-4 py-3 text-right" :class="course.tone">{{ course.grade }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section ref="planSection" class="bg-surface">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <h2 class="heading-2 max-w-hero">Plan what comes next</h2>
        <div class="mt-12 grid gap-12 tablet:grid-cols-5">
          <div class="rounded-2xl border border-line bg-raised p-6 tablet:col-span-3" aria-hidden="true">
            <p class="caption-2 text-ink-soft">If you score these grades next semester</p>
            <div class="mt-4 flex flex-col gap-2">
              <div v-for="row in whatIfRows" :key="row.course" class="flex items-center justify-between gap-4 rounded-lg bg-surface p-3">
                <span class="body-5">{{ row.course }}</span>
                <span class="flex gap-1">
                  <span
                    v-for="grade in ['A', 'B', 'C']"
                    :key="grade"
                    class="caption-3 flex size-8 items-center justify-center rounded-md"
                    :class="grade === row.grade ? 'bg-accent text-on-accent' : 'bg-overlay text-ink-soft'"
                  >{{ grade }}</span>
                </span>
              </div>
            </div>
            <div class="mt-6 flex items-end justify-between gap-4">
              <div>
                <p class="caption-2 text-ink-soft">Your CGPA would be</p>
                <p class="heading-3 tabular">3.59</p>
              </div>
              <p class="body-5 inline-flex items-center gap-2 text-accent-ink">
                <PhTrendUp :size="16" weight="bold" />
                Up 0.07
              </p>
            </div>
          </div>
          <dl class="flex flex-col gap-6 tablet:col-span-2">
            <div v-for="item in planning" :key="item.title">
              <dt class="title-2">{{ item.title }}</dt>
              <dd class="body-6 mt-1 text-ink-soft">{{ item.detail }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section ref="schoolSection" class="mx-auto max-w-6xl px-6 py-24">
      <div class="grid items-end gap-6 tablet:grid-cols-2">
        <h2 class="heading-2">Fits your school</h2>
        <p class="body-3 text-ink-soft">Choose the 4.0, 5.0, or UK scale, or build a custom grading scale for your own school and keep the same tools.</p>
      </div>
      <div class="mt-12 overflow-x-auto rounded-2xl border border-line" tabindex="0" role="region" aria-label="Grading scales compared">
        <table class="w-full min-w-96 text-left">
          <thead class="bg-surface">
            <tr>
              <th v-for="scale in scales" :key="scale.name" scope="col" class="title-4 p-4">{{ scale.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(_, rowIndex) in scales[0]!.grades" :key="rowIndex" class="border-t border-line">
              <td v-for="scale in scales" :key="scale.name" class="body-6 tabular p-4 text-ink-soft">{{ scale.grades[rowIndex] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="body-6 mt-6 text-ink-soft">
        Just need a quick answer? Use a free calculator page for the
        <a class="text-link" href="/calculator/4-0-gpa">4.0 scale</a>,
        <a class="text-link" href="/calculator/5-0-gpa">5.0 scale</a>, or
        <a class="text-link" href="/calculator/uk">UK scale</a>.
      </p>
    </section>

    <section ref="keepSection" class="border-y border-line">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <h2 class="heading-2 max-w-hero">Enter it once, keep it safe</h2>
        <div class="mt-12 grid gap-x-12 gap-y-8 tablet:grid-cols-2">
          <div v-for="group in keeping" :key="group.title">
            <h3 class="title-1 flex items-center gap-2">
              <component :is="group.icon" :size="24" class="text-accent-ink" aria-hidden="true" />
              {{ group.title }}
            </h3>
            <ul class="mt-4 flex flex-col gap-2">
              <li v-for="item in group.items" :key="item" class="body-6 text-ink-soft">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-24" data-tagline>
      <TaglineReveal :lines="['Every semester is a star.', 'Chart the line to where you want to finish.']" />
    </section>

    <section id="how-it-works" ref="howSection" class="scroll-mt-24 bg-surface">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <h2 class="heading-2">How it works</h2>
        <ol class="mt-12 grid gap-8 tablet:grid-cols-3 tablet:items-end">
          <li v-for="(step, index) in steps" :key="step.title" class="flex flex-col gap-2" :class="step.offset">
            <PhStarFour :size="32" weight="fill" class="text-accent-ink" aria-hidden="true" />
            <h3 class="heading-6">{{ index + 1 }}. {{ step.title }}</h3>
            <p class="body-6 text-ink-soft">{{ step.detail }}</p>
          </li>
        </ol>
        <p class="body-6 mt-12 text-ink-soft">
          Want to look around first?
          <button type="button" class="text-link" :disabled="starting" @click="startDemo">See a demo</button>
          with sample grades.
        </p>
      </div>
    </section>

    <section ref="proofSection" class="mx-auto max-w-6xl px-6 py-24">
      <h2 class="heading-2">What students say</h2>
      <div class="mt-12 grid gap-4 tablet:grid-cols-3">
        <figure class="rounded-2xl border border-dashed border-line-strong p-6 tablet:col-span-2" data-placeholder>
          <blockquote class="heading-5 text-ink-soft">{{ placeholder('testimonial') }}</blockquote>
          <figcaption class="caption-2 mt-4 text-ink-muted">{{ placeholder('student name and school') }}</figcaption>
        </figure>
        <div class="flex flex-col justify-center rounded-2xl border border-dashed border-line-strong p-6" data-placeholder>
          <p class="heading-5 text-ink-soft">{{ placeholder('statistic') }}</p>
          <p class="caption-2 mt-2 text-ink-muted">Placeholder until real figures exist</p>
        </div>
      </div>
    </section>

    <section id="faq" ref="faqSection" class="mx-auto max-w-3xl scroll-mt-24 px-6 pb-24">
      <h2 class="heading-2">Questions, answered</h2>
      <div class="mt-8 flex flex-col">
        <details v-for="item in faqs" :key="item.question" class="faq-item border-b border-line">
          <summary class="title-2 flex cursor-pointer list-none items-center justify-between gap-4 py-4">
            {{ item.question }}
            <PhPlus class="faq-icon shrink-0 text-ink-soft" :size="16" weight="bold" aria-hidden="true" />
          </summary>
          <p class="body-3 pb-4 text-ink-soft">{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <section class="dark relative isolate overflow-hidden text-ink" data-final-action>
      <NightScene class="-z-10" />
      <div class="mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-24 text-center">
        <h2 class="heading-2 max-w-hero">Start charting your course</h2>
        <p class="body-3 mt-4 max-w-hero text-ink">Add your first semester in a few minutes and see what it takes to reach your target.</p>
        <NuxtLink to="/register" class="button button-primary mt-8">
          Create your free account
          <PhArrowRight :size="16" weight="bold" aria-hidden="true" />
        </NuxtLink>
        <div class="h-48" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  PhArrowRight,
  PhArrowsClockwise,
  PhChartLineUp,
  PhCalendarBlank,
  PhClipboardText,
  PhKeyboard,
  PhMedal,
  PhPlus,
  PhShareNetwork,
  PhShieldCheck,
  PhSparkle,
  PhStarFour,
  PhTrendUp,
} from '@phosphor-icons/vue'

const { starting, startDemo } = useDemo()

const standSection = useReveal()
const planSection = useReveal()
const schoolSection = useReveal()
const keepSection = useReveal()
const howSection = useReveal()
const proofSection = useReveal()
const faqSection = useReveal()

const placeholder = (name: string) => `{{${name}}}`

const standing = [
  { icon: PhChartLineUp, title: 'GPA and CGPA tracking', detail: 'See your semester GPA and CGPA update the moment you add a grade.' },
  { icon: PhCalendarBlank, title: 'Records by year and semester', detail: 'Every course sits in the academic year and semester it belongs to.' },
  { icon: PhTrendUp, title: 'GPA progress chart', detail: 'Follow your results across every semester at a glance.' },
  { icon: PhMedal, title: 'CGPA classification', detail: 'Know which degree class your current CGPA puts you in.' },
  { icon: PhArrowsClockwise, title: 'Retakes and school rules', detail: 'Repeated and pass or fail courses count the way your school counts them.' },
  { icon: PhClipboardText, title: 'Assessment tracker', detail: 'Enter coursework scores and see what you need on the final exam.' },
]

const sampleCourses = [
  { name: 'Algorithms', code: 'CSC 301', credits: 4, grade: 'A', tone: 'text-positive' },
  { name: 'Operating Systems', code: 'CSC 305', credits: 3, grade: 'A', tone: 'text-positive' },
  { name: 'Database Systems', code: 'CSC 312', credits: 3, grade: 'B+', tone: 'text-accent-ink' },
]

const whatIfRows = [
  { course: 'Compilers', grade: 'A' },
  { course: 'Computer Networks', grade: 'B' },
  { course: 'Software Engineering', grade: 'A' },
]

const planning = [
  { title: 'Target forecaster', detail: 'Set a target CGPA to see the average you need, with scenarios for every result.' },
  { title: 'What if grades', detail: 'Try different grades for upcoming courses without touching your real record.' },
  { title: 'Saved degree goal', detail: 'Save your target and total credits, then follow your progress from the dashboard.' },
  { title: 'Scholarship and honors tracker', detail: 'Track the GPA you must keep and get a warning when a requirement is at risk.' },
]

const scales = [
  { name: '4.0 scale', grades: ['A: 4.0', 'B: 3.0', 'C: 2.0'] },
  { name: '5.0 scale', grades: ['A: 5.0', 'B: 4.0', 'C: 3.0'] },
  { name: 'UK scale', grades: ['First', 'Upper second', 'Lower second'] },
  { name: 'Custom scale', grades: ['Your grades', 'Your points', 'Your cutoffs'] },
]

const keeping = [
  { icon: PhKeyboard, title: 'Enter it fast', items: ['Type a score and get the grade.', 'Keyboard entry for a whole semester of courses.', 'Course templates for common degrees.'] },
  { icon: PhShieldCheck, title: 'Keep it safe', items: ['Real accounts with password reset.', 'Records synced across your devices.', 'JSON data export and import from a backup.'] },
  { icon: PhShareNetwork, title: 'Share it', items: ['PDF semester reports for advisors and applications.', 'A private progress share link for a parent or sponsor.'] },
  { icon: PhSparkle, title: 'Make it yours', items: ['Dark and light modes.', 'Demo data, so you can explore before adding your own.'] },
]

const steps = [
  { title: 'Add your courses', detail: 'Enter each course with its credits and the grade you earned or expect.', offset: '' },
  { title: 'See your GPA', detail: 'Your semester GPA and CGPA are calculated as soon as you enter a grade.', offset: 'tablet:pb-8' },
  { title: 'Plan your next move', detail: 'Set a target and find out what you need from the semesters ahead.', offset: 'tablet:pb-16' },
]

const faqs = [
  { question: 'Is GradeMate really free?', answer: 'Yes. Every feature is free for every student, with no paid plan and no credit card.' },
  { question: 'Which grading scales does it support?', answer: 'The 4.0 scale, the 5.0 scale, and UK degree classifications. You can also build a custom scale for your school.' },
  { question: 'What if my school has its own rules?', answer: 'You can set how retakes count, mark pass or fail courses, and add your own grades and cutoffs.' },
  { question: 'Can I try it before creating an account?', answer: 'Yes. The demo opens a full dashboard with sample grades, so you can explore everything first.' },
  { question: 'Will my records be on all my devices?', answer: 'Yes. Your records are saved to your account and synced, so they appear wherever you sign in.' },
  { question: 'Can I get my data out?', answer: 'Yes. You can download your records as JSON, restore them from a backup, and create PDF semester reports.' },
  { question: 'Is my GPA here official?', answer: 'No. GradeMate calculates from what you enter, so your institution\'s records always take priority.' },
  { question: 'Does it work on my phone?', answer: 'Yes. GradeMate works in the browser on phones, tablets, and computers, with no download.' },
]
</script>

<style scoped>
.faq-icon {
  transition: transform 500ms var(--ease-weighted);
}

.faq-item[open] .faq-icon {
  transform: rotate(45deg);
}

.faq-item summary::-webkit-details-marker {
  display: none;
}
</style>
