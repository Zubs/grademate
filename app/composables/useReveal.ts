export function startReveal(element: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const { top } = element.getBoundingClientRect()
  if (top < window.innerHeight) {
    return () => {}
  }

  element.classList.add('reveal-pending')
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) {
      return
    }

    element.classList.add('reveal-done')
    observer.disconnect()
  })
  observer.observe(element)
  return () => observer.disconnect()
}

export function useReveal() {
  const target = ref<HTMLElement | null>(null)
  let stop = () => {}

  onMounted(() => {
    if (target.value) {
      stop = startReveal(target.value)
    }
  })
  onBeforeUnmount(() => stop())

  return target
}
