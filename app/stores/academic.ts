import { defineStore } from 'pinia'

export interface Course {
    id: string
    name: string
    code: string
    credits: number
    grade: string
    gradePoints: number
}

export interface Semester {
    id: string
    name: string
    year: string
    season: 'First' | 'Second' | 'Summer'
    courses: Course[]
    gpa: number
    totalCredits: number
    locked: boolean
}

export interface AcademicYear {
    id: string
    label: string   // e.g. "2023/2024"
    semesters: Semester[]
}

export type GradingScale = '4.0' | '5.0' | 'uk'

// Grading scales
const SCALES = {
    '4.0': [
        {
            grade: 'A+',
            min: 97,
            points: 4.0
        },
        {
            grade: 'A',
            min: 93,
            points: 4.0
        },
        {
            grade: 'A-',
            min: 90,
            points: 3.7
        },
        {
            grade: 'B+',
            min: 87,
            points: 3.3
        },
        {
            grade: 'B',
            min: 83,
            points: 3.0
        },
        {
            grade: 'B-',
            min: 80,
            points: 2.7
        },
        {
            grade: 'C+',
            min: 77,
            points: 2.3
        },
        {
            grade: 'C',
            min: 73,
            points: 2.0
        },
        {
            grade: 'C-',
            min: 70,
            points: 1.7
        },
        {
            grade: 'D',
            min: 60,
            points: 1.0
        },
        {
            grade: 'F',
            min: 0,
            points: 0.0
        },
    ],
    '5.0': [
        {
            grade: 'A',
            min: 70,
            points: 5.0
        },
        {
            grade: 'B',
            min: 60,
            points: 4.0
        },
        {
            grade: 'C',
            min: 50,
            points: 3.0
        },
        {
            grade: 'D',
            min: 45,
            points: 2.0
        },
        {
            grade: 'E',
            min: 40,
            points: 1.0
        },
        {
            grade: 'F',
            min: 0,
            points: 0.0
        },
    ],
    'uk': [
        {
            grade: 'First (1st)',
            min: 70,
            points: 4.0
        },
        {
            grade: 'Upper Second (2:1)',
            min: 60,
            points: 3.3
        },
        {
            grade: 'Lower Second (2:2)',
            min: 50,
            points: 2.7
        },
        {
            grade: 'Third (3rd)',
            min: 40,
            points: 2.0
        },
        {
            grade: 'Fail',
            min: 0,
            points: 0.0
        },
    ],
}

export const useAcademicStore = defineStore('academic', () => {
    const years = ref<AcademicYear[]>([])
    const gradingScale = ref<GradingScale>('4.0')

    const loaded = ref(false)

    function hydrate() {
        const savedYears = localStorage.getItem('grademate_years')
        const savedScale = localStorage.getItem('grademate_scale')
        if (savedYears) {
            try {
                years.value = JSON.parse(savedYears)
            } catch {
                years.value = []
            }
        }
        if (savedScale && savedScale in SCALES) {
            gradingScale.value = savedScale as GradingScale
        }
        loaded.value = true
    }

    function persist() {
        if (import.meta.client && loaded.value) {
            localStorage.setItem('grademate_years', JSON.stringify(years.value))
            localStorage.setItem('grademate_scale', gradingScale.value)
        }
    }

    const scaleGrades = computed(() => SCALES[gradingScale.value])
    const maxPoints = computed(() => Math.max(...scaleGrades.value.map(g => g.points)))

    function calcSemesterGPA(courses: Course[]): { gpa: number; totalCredits: number } {
        const valid = courses.filter(c => c.gradePoints !== null && c.credits > 0)
        if (!valid.length) {
            return { gpa: 0, totalCredits: 0 }
        }

        const totalCredits = valid.reduce((s, c) => s + c.credits, 0)
        const weightedSum = valid.reduce((s, c) => s + c.gradePoints * c.credits, 0)
        return { gpa: totalCredits ? Math.round((weightedSum / totalCredits) * 100) / 100 : 0, totalCredits }
    }

    const cgpa = computed(() => {
        const allSems = years.value.flatMap(y => y.semesters)
        const totalCredits = allSems.reduce((s, sem) => s + sem.totalCredits, 0)
        const weighted = allSems.reduce((s, sem) => s + sem.gpa * sem.totalCredits, 0)
        return totalCredits ? Math.round((weighted / totalCredits) * 100) / 100 : 0
    })

    const semesterHistory = computed(() =>
        years.value.flatMap(y =>
            y.semesters.map(s => ({ label: `${s.season} ${y.label}`, gpa: s.gpa, year: y.label }))
        )
    )

    const totalCredits = computed(() =>
        years.value.flatMap(y => y.semesters).reduce((s, sem) => s + sem.totalCredits, 0)
    )

    const completedCourses = computed(() =>
        years.value.flatMap(y => y.semesters.flatMap(s => s.courses)).length
    )

    // CRUD
    function addYear(label: string) {
        const year: AcademicYear = {id: uid(), label, semesters: []}
        years.value.push(year)
        persist()
        return year
    }

    function removeYear(yearId: string) {
        years.value = years.value.filter(y => y.id !== yearId)
        persist()
    }

    function addSemester(yearId: string, season: Semester['season']) {
        const year = years.value.find(y => y.id === yearId)
        if (!year) {
            return
        }

        const sem: Semester = {
            id: uid(),
            name: `${season} Semester`,
            year: year.label,
            season,
            courses: [],
            gpa: 0,
            totalCredits: 0,
            locked: false,
        }
        year.semesters.push(sem)
        persist()
        return sem
    }

    function removeSemester(yearId: string, semId: string) {
        const year = years.value.find(y => y.id === yearId)
        if (!year) {
            return
        }

        year.semesters = year.semesters.filter(s => s.id !== semId)
        persist()
    }

    function upsertCourse(yearId: string, semId: string, course: Partial<Course> & { id?: string }) {
        const year = years.value.find(y => y.id === yearId)
        const sem = year?.semesters.find(s => s.id === semId)
        if (!sem) {
            return
        }

        if (course.id) {
            const idx = sem.courses.findIndex(c => c.id === course.id)
            if (idx > -1) {
                sem.courses[idx] = { ...sem.courses[idx], ...course }
            }
        } else {
            sem.courses.push({
                id: uid(),
                name: '',
                code: '',
                credits: 3,
                grade: '',
                gradePoints: 0,
                ...course,
            })
        }
        // Recalculate
        const { gpa, totalCredits } = calcSemesterGPA(sem.courses)
        sem.gpa = gpa
        sem.totalCredits = totalCredits
        persist()
    }

    function removeCourse(yearId: string, semId: string, courseId: string) {
        const year = years.value.find(y => y.id === yearId)
        const sem = year?.semesters.find(s => s.id === semId)
        if (!sem) {
            return
        }

        sem.courses = sem.courses.filter(c => c.id !== courseId)
        const { gpa, totalCredits } = calcSemesterGPA(sem.courses)
        sem.gpa = gpa;
        sem.totalCredits = totalCredits
        persist()
    }

    function setScale(scale: GradingScale) {
        gradingScale.value = scale
        persist()
    }

    // Target forecaster
    function forecastRequiredGPA(targetCGPA: number, upcomingCredits: number): number | null {
        const current = cgpa.value
        const currentCredits = totalCredits.value
        if (!upcomingCredits) {
            return null
        }

        const required = ((targetCGPA * (currentCredits + upcomingCredits)) - (current * currentCredits)) / upcomingCredits
        return Math.round(required * 100) / 100
    }

    // Load demo data
    function loadDemo() {
        years.value = [
            {
                id: uid(), label: '2022/2023', semesters: [
                    {
                        id: uid(),
                        name: 'First Semester',
                        year: '2022/2023',
                        season: 'First',
                        gpa: 3.5,
                        totalCredits: 18,
                        locked: true,
                        courses: [
                            {
                                id: uid(),
                                name: 'Calculus I',
                                code: 'MTH101',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                            {
                                id: uid(),
                                name: 'Introduction to Programming',
                                code: 'CSC101',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                            {
                                id: uid(),
                                name: 'Technical Writing',
                                code: 'ENG101',
                                credits: 2,
                                grade: 'B+',
                                gradePoints: 3.3
                            },
                            {
                                id: uid(),
                                name: 'Physics I',
                                code: 'PHY101',
                                credits: 3,
                                grade: 'B',
                                gradePoints: 3.0
                            },
                            {
                                id: uid(),
                                name: 'Linear Algebra',
                                code: 'MTH102',
                                credits: 3,
                                grade: 'A-',
                                gradePoints: 3.7
                            },
                            {
                                id: uid(),
                                name: 'Digital Logic',
                                code: 'CSC103',
                                credits: 3,
                                grade: 'B+',
                                gradePoints: 3.3
                            },
                            {
                                id: uid(),
                                name: 'General Studies',
                                code: 'GST101',
                                credits: 1,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                        ],
                    },
                    {
                        id: uid(),
                        name: 'Second Semester',
                        year: '2022/2023',
                        season: 'Second',
                        gpa: 3.65,
                        totalCredits: 18,
                        locked: true,
                        courses: [
                            {
                                id: uid(),
                                name: 'Calculus II',
                                code: 'MTH201',
                                credits: 3,
                                grade: 'A-',
                                gradePoints: 3.7
                            },
                            {
                                id: uid(),
                                name: 'Data Structures',
                                code: 'CSC201',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                            {
                                id: uid(),
                                name: 'Discrete Math',
                                code: 'MTH202',
                                credits: 3,
                                grade: 'B+',
                                gradePoints: 3.3
                            },
                            {
                                id: uid(),
                                name: 'Computer Organisation',
                                code: 'CSC202',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                            {
                                id: uid(),
                                name: 'Physics II',
                                code: 'PHY201',
                                credits: 3,
                                grade: 'B+',
                                gradePoints: 3.3
                            },
                            {
                                id: uid(),
                                name: 'Statistics',
                                code: 'STA201',
                                credits: 3,
                                grade: 'A-',
                                gradePoints: 3.7
                            },
                        ],
                    },
                ],
            },
            {
                id: uid(),
                label: '2023/2024',
                semesters: [
                    {
                        id: uid(),
                        name: 'First Semester',
                        year: '2023/2024',
                        season: 'First',
                        gpa: 3.8,
                        totalCredits: 18,
                        locked: false,
                        courses: [
                            {
                                id: uid(),
                                name: 'Algorithms',
                                code: 'CSC301',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                            {
                                id: uid(),
                                name: 'Operating Systems',
                                code: 'CSC302',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                            {
                                id: uid(),
                                name: 'Database Systems',
                                code: 'CSC303',
                                credits: 3,
                                grade: 'A-',
                                gradePoints: 3.7
                            },
                            {
                                id: uid(),
                                name: 'Computer Networks',
                                code: 'CSC304',
                                credits: 3,
                                grade: 'B+',
                                gradePoints: 3.3
                            },
                            {
                                id: uid(),
                                name: 'Software Engineering',
                                code: 'CSC305',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                            {
                                id: uid(),
                                name: 'Numerical Methods',
                                code: 'MTH301',
                                credits: 3,
                                grade: 'A',
                                gradePoints: 4.0
                            },
                        ],
                    },
                ],
            },
        ]
        persist()
    }

    return {
        years,
        hydrate,
        gradingScale,
        scaleGrades,
        maxPoints,
        cgpa,
        semesterHistory,
        totalCredits,
        completedCourses,
        addYear,
        removeYear,
        addSemester,
        removeSemester,
        upsertCourse,
        removeCourse,
        setScale,
        forecastRequiredGPA,
        loadDemo,
    }
})

function uid() {
    return Math.random().toString(36).slice(2, 10)
}
