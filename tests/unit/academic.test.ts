import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAcademicStore } from '~/stores/academic'

function storeWithSemester() {
  const academic = useAcademicStore()
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
    const academic = useAcademicStore()
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
    const academic = useAcademicStore()
    academic.loadDemo()
    expect(academic.years.length).toBe(2)
    expect(academic.cgpa).toBe(3.65)
  })

  it('reports the maximum points for each scale', () => {
    const academic = useAcademicStore()
    academic.setScale('5.0')
    expect(academic.maxPoints).toBe(5)
    academic.setScale('uk')
    expect(academic.maxPoints).toBe(4)
  })
})
