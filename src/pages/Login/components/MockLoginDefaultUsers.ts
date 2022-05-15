import { MockLogin } from 'resources/common/MockLogin';

export function generateStudentUsers(count : number) : MockLogin[] {
    const out : MockLogin[] = [];

    for (let i = 1; i <= count; i++) {
        const idx = i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        out.push({
            neptun: `stud${idx}`,
            name: `student${idx}`,
            email: `student${idx}@example.com`,
            isStudent: true,
            isTeacher: false,
            isAdmin: false,
        });
    }

    return out;
}

export function generateInstructorUsers(count : number) : MockLogin[] {
    const out : MockLogin[] = [];

    for (let i = 1; i <= count; i++) {
        const idx = i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        out.push({
            neptun: `inst${idx}`,
            name: `instructor${idx}`,
            email: `instructor${idx}@example.com`,
            isStudent: false,
            isTeacher: true,
            isAdmin: false,
        });
    }

    return out;
}

export function generateAdminUsers(count : number) : MockLogin[] {
    const out : MockLogin[] = [];

    for (let i = 1; i <= count; i++) {
        const idx = i.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        out.push({
            neptun: `admr${idx}`,
            name: `admin${idx}`,
            email: `admin${idx}@example.com`,
            isStudent: false,
            isTeacher: false,
            isAdmin: true,
        });
    }

    return out;
}
