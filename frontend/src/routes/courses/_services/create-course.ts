import axios from "axios";
import type { CourseI } from "./types";

export const createCourse = async (
	course: Omit<CourseI, "id">,
): Promise<CourseI> => {
	console.debug("CREATE COURSE", course);
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/course/`,
		course,
	);

	console.debug("CREATE COURSE RESPONSE", response.data);

	return response.data;
};
