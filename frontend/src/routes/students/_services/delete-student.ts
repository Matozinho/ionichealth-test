import axios from "axios";

export const deleteStudent = async (studentId: string) => {
	const response = await axios.delete(
		`${import.meta.env.VITE_API_URL}/student/${studentId}/`,
	);
	return response.data;
};
