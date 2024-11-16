import axios from "axios";

export interface DisenrollStudentParams {
	studentId: string;
	courseId: string;
}

export const disenrollStudent = async ({
	studentId,
	courseId,
}: DisenrollStudentParams) => {
	const response = await axios.delete(
		`${import.meta.env.VITE_API_URL}/enrollment/${studentId}/${courseId}/`,
	);
	return response.data;
};
