import axios from "axios";
import type { CourseI } from "./types";

export const createCourse = async (
	course: Omit<CourseI, "id">,
): Promise<CourseI> => {
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/course/`,
		course,
	);

	return response.data;
};
