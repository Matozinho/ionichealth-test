import axios from "axios";
import type { CourseI } from "./types";

export const fetchCourses = async (): Promise<CourseI[]> => {
	const response = await axios(`${import.meta.env.VITE_API_URL}/course/`);
	return response.data;
};
