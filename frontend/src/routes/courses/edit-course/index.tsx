import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import { courseSchema } from "../_components/dialog-form";
import { FormFields } from "../_components/form-fields";
import { fetchCourseById } from "../_services/fetch-course-by-id";
import { updateCourse } from "../_services/update-course";
import { Loader2 } from "lucide-react";
import { format, parse } from "date-fns";

const courseSchemaExtended = courseSchema.concat(
	yup.object().shape({
		id: yup.string().required(),
	}),
);
export type CourseSchemaExtended = yup.InferType<typeof courseSchemaExtended>;

export const EditCoursePage = () => {
	const { courseId } = useParams();

	const form = useForm<CourseSchemaExtended>({
		resolver: yupResolver(courseSchemaExtended),
	});

	const { data, isLoading } = useQuery(
		["course", courseId],
		async () => await fetchCourseById(courseId),
	);

	const { mutate, isLoading: loadingSave } = useMutation({
		mutationFn: updateCourse,
		onSuccess: () => {
			toast.success("Course updated successfully");
		},
		onError: (error) => {
			console.error("[EditCoursePage] mutation: ", error);
			toast.error("An error occurred while updating the course");
		},
	});

	useEffect(() => {
		if (!isLoading && data) {
			const formattedData = {
				...data,
				begin_date: parse(data.begin_date, "yyyy-MM-dd", new Date()),
				end_date: parse(data.end_date, "yyyy-MM-dd", new Date()),
			};
			form.reset(formattedData);
		}
	}, [data]);

	const onSubmit = useCallback((data: CourseSchemaExtended) => {
		const formattedData = {
			...data,
			begin_date: format(data.begin_date, "yyyy-MM-dd"),
			end_date: format(data.end_date, "yyyy-MM-dd"),
		};
		mutate(formattedData);
	}, []);

	return (
		<section className="flex flex-col w-full items-center">
			<Form {...form}>
				<form
					className="flex flex-col gap-4 bg-slate-50 w-full max-w-md p-4 rounded-lg"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormFields />
					<Button type="submit" className="mt-4">
						{loadingSave ? (
							<Loader2 className="animate-spin" />
						) : (
							"Update course"
						)}
					</Button>
				</form>
			</Form>
		</section>
	);
};
