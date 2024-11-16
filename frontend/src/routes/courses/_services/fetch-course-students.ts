import type { StudentI } from "@/routes/students/_services/types";
import axios from "axios";

export interface EnrolledStudentI extends StudentI {
	enrollment_date: string;
}

export const fetchCourseStudents = async (
	course_id?: string,
): Promise<EnrolledStudentI[]> => {
	if (!course_id) return [];

	const response = await axios(
		`${import.meta.env.VITE_API_URL}/course/${course_id}/students`,
	);
	return response.data;
};
