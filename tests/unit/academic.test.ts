import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAcademicStore } from '~/stores/academic'

function loadedStore() {
  const academic = useAcademicStore()
  academic.hydrate()
  return academic
}

function storeWithSemester() {
  const academic = loadedStore()
  const year = academic.addYear('2024/2025')
  const semester = academic.addSemester(year.id, 'First')!
  return { academic, yearId: year.id, semesterId: semester.id }
}

describe('academic store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts with no records and a zero CGPA', () => {
    const academic = loadedStore()
    expect(academic.years).toEqual([])
    expect(academic.cgpa).toBe(0)
    expect(academic.totalCredits).toBe(0)
  })

  it('weights semester GPA by credits', () => {
    const { academic, yearId, semesterId } = storeWithSemester()
    academic.upsertCourse(yearId, semesterId, { name: 'Algorithms', credits: 4, grade: 'A', gradePoints: 4 })
    academic.upsertCourse(yearId, semesterId, { name: 'Networks', credits: 2, grade: 'C', gradePoints: 2 })
    const semester = academic.years[0]!.semesters[0]!
    expect(semester.gpa).toBe(3.33)
    expect(semester.totalCredits).toBe(6)
  })

  it('weights CGPA across semesters by credits', () => {
    const { academic, yearId, semesterId } = storeWithSemester()
    academic.upsertCourse(yearId, semesterId, { credits: 6, grade: 'A', gradePoints: 4 })
    const second = academic.addSemester(yearId, 'Second')!
    academic.upsertCourse(yearId, second.id, { credits: 3, grade: 'C', gradePoints: 2 })
    expect(academic.cgpa).toBe(3.33)
    expect(academic.totalCredits).toBe(9)
  })

  it('recalculates when a course is edited or removed', () => {
    const { academic, yearId, semesterId } = storeWithSemester()
    academic.upsertCourse(yearId, semesterId, { credits: 3, grade: 'A', gradePoints: 4 })
    academic.upsertCourse(yearId, semesterId, { credits: 3, grade: 'C', gradePoints: 2 })
    const [first, second] = academic.years[0]!.semesters[0]!.courses
    academic.upsertCourse(yearId, semesterId, { id: second!.id, grade: 'B', gradePoints: 3 })
    expect(academic.years[0]!.semesters[0]!.gpa).toBe(3.5)
    academic.removeCourse(yearId, semesterId, first!.id)
    expect(academic.years[0]!.semesters[0]!.gpa).toBe(3)
  })

  it('removes a year with its semesters', () => {
    const { academic, yearId } = storeWithSemester()
    academic.removeYear(yearId)
    expect(academic.years).toEqual([])
  })

  it('forecasts the GPA needed for a target', () => {
    const { academic, yearId, semesterId } = storeWithSemester()
    academic.upsertCourse(yearId, semesterId, { credits: 60, grade: 'B', gradePoints: 3.2 })
    expect(academic.forecastRequiredGPA(3.4, 30)).toBe(3.8)
    expect(academic.forecastRequiredGPA(3.4, 0)).toBeNull()
  })

  it('loads demo data with a CGPA of 3.65', () => {
    const academic = loadedStore()
    academic.loadDemo()
    expect(academic.years.length).toBe(2)
    expect(academic.cgpa).toBe(3.65)
  })

  it('reports the maximum points for each scale', () => {
    const academic = loadedStore()
    academic.setScale('5.0')
    expect(academic.maxPoints).toBe(5)
    academic.setScale('uk')
    expect(academic.maxPoints).toBe(4)
  })

  describe('saved data', () => {
    it('writes nothing before records have loaded', () => {
      localStorage.setItem('grademate_years', JSON.stringify([{ id: 'a', label: '2020/2021', semesters: [] }]))
      const academic = useAcademicStore()
      academic.addYear('2030/2031')
      expect(JSON.parse(localStorage.getItem('grademate_years')!)).toHaveLength(1)
    })

    it('keeps every record when saving after loading', () => {
      localStorage.setItem('grademate_years', JSON.stringify([{ id: 'a', label: '2020/2021', semesters: [] }]))
      const academic = loadedStore()
      academic.addYear('2030/2031')
      const saved = JSON.parse(localStorage.getItem('grademate_years')!) as { label: string }[]
      expect(saved.map(year => year.label)).toEqual(['2020/2021', '2030/2031'])
    })

    it('leaves unreadable records in place until a change', () => {
      localStorage.setItem('grademate_years', '{broken')
      const academic = loadedStore()
      expect(academic.years).toEqual([])
      expect(localStorage.getItem('grademate_years')).toBe('{broken')
      academic.addYear('2030/2031')
      expect(JSON.parse(localStorage.getItem('grademate_years')!)).toHaveLength(1)
    })

    it('restores a saved scale and ignores an unknown one', () => {
      localStorage.setItem('grademate_scale', '5.0')
      expect(loadedStore().gradingScale).toBe('5.0')
      setActivePinia(createPinia())
      localStorage.setItem('grademate_scale', 'nonsense')
      expect(loadedStore().gradingScale).toBe('4.0')
    })
  })
})
