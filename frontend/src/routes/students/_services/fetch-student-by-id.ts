import axios from "axios";
import type { StudentI } from "./types";

export const fetchStudentById = async (
	studentId?: string,
): Promise<StudentI> => {
	if (!studentId) throw new Error("Student id is required");

	const response = await axios(
		`${import.meta.env.VITE_API_URL}/student/${studentId}`,
	);

	return response.data;
};
