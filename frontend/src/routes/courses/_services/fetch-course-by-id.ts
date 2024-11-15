import axios from "axios";
import type { CourseI } from "./types";

export const fetchCourseById = async (id?: string): Promise<CourseI> => {
	if (!id) throw new Error("Course id is required");

	const response = await axios(`${import.meta.env.VITE_API_URL}/course/${id}/`);
	return response.data;
};
