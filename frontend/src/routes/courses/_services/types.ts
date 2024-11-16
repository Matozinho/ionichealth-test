export interface CourseI {
	id: string;
	name: string;
	begin_date: string;
	end_date: string;
}

export interface EnrollmentI {
	id: string;
	enrollment_date: string;
	student: string;
	course: string;
}
