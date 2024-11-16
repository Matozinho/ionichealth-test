import axios from "axios";
import type { StudentI } from "./types";

export interface CreateStudentI extends Omit<StudentI, "id" | "courses"> {
	courses: string[]; // the ids of the courses
}

export const createStudent = async (data: CreateStudentI) => {
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/student/`,
		data,
	);

	return response.data;
};
