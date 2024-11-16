import axios from "axios";
import type { StudentI } from "./types";

export interface UpdateStudentI extends Omit<StudentI, "courses"> {
	courses: string[];
}

export const updateStudent = async (
	studentId: string,
	student: UpdateStudentI,
): Promise<StudentI> => {
	const response = await axios.put(
		`${import.meta.env.VITE_API_URL}/student/${studentId}/`,
		student,
	);

	return response.data;
};
