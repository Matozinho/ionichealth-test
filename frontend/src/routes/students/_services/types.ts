import type { CourseI, EnrollmentI } from "@/routes/courses/_services/types";

export interface StudentI {
	id: string;
	name: string;
	cpf: string;
	email: string;
	cellphone: string;
	courses: EnrollmentI[];
}
