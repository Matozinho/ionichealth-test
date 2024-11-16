import axios from "axios";
import type { StudentI } from "./types";

export const fetchStudents = async (): Promise<StudentI[]> => {
	const response = await axios.get(`${import.meta.env.VITE_API_URL}/student/`);
	return response.data;
};
