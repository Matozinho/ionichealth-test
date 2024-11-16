import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { EnrollmentI } from "@/routes/courses/_services/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import { studentSchema } from "../_components/dialog-form";
import { FormFields } from "../_components/form-fields";
import { fetchStudentById } from "../_services/fetch-student-by-id";
import {
	type UpdateStudentI,
	updateStudent,
} from "../_services/update-student";

const studentSchemaExtended = studentSchema.concat(
	yup.object().shape({
		id: yup.string().required(),
	}),
);
export type StudentSchemaExtended = yup.InferType<typeof studentSchemaExtended>;

export const EditStudentPage = () => {
	const { studentId } = useParams();

	const form = useForm<StudentSchemaExtended>({
		resolver: yupResolver(studentSchemaExtended),
	});

	const { data, isLoading } = useQuery(
		["student", studentId],
		async () => await fetchStudentById(studentId),
	);

	const { mutate, isLoading: loadingSave } = useMutation({
		mutationFn: async (data: UpdateStudentI) =>
			await updateStudent(data.id, data),
		onSuccess: () => {
			toast.success("Student updated successfully");
		},
		onError: (error) => {
			console.error("[EditStudentPage] mutation: ", error);
			toast.error("An error occurred while updating the student");
		},
	});

	const formatEnrollments = (enrollments: EnrollmentI[]) => {
		return enrollments.map((enrollment) => enrollment.course);
	};

	useEffect(() => {
		if (!isLoading && data) {
			form.reset({
				...data,
				courses: formatEnrollments(data.courses),
			});
		}
	}, [data]);

	const onSubmit = useCallback((data: StudentSchemaExtended) => {
		mutate(data);
	}, []);

	return (
		<section className="flex flex-col w-full items-center p-8">
			<Form {...form}>
				<form
					className="flex flex-col gap-4 bg-slate-50 w-full max-w-md p-4 rounded-lg"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormFields isEditing />
					<Button type="submit" className="mt-4">
						{loadingSave ? (
							<Loader2 className="animate-spin" />
						) : (
							"Update student"
						)}
					</Button>
				</form>
			</Form>
		</section>
	);
};
