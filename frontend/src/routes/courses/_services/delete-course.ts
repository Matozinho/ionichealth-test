import axios from "axios";

export const deleteCourse = async (courseId: string) => {
	const response = await axios.delete(
		`${import.meta.env.VITE_API_URL}/course/${courseId}/`,
	);

	return response.data;
};
