import axios from "axios";
import type { CourseI } from "./types";

export const updateCourse = async (course: CourseI): Promise<CourseI> => {
	const response = await axios.put(
		`${import.meta.env.VITE_API_URL}/course/${course.id}/`,
		course,
	);

	return response.data;
};
