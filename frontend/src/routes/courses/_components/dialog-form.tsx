import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { DialogProps } from "@radix-ui/react-dialog";
import { type FC, type PropsWithChildren, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCourse } from "../_services/create-course";
import { FormFields } from "./form-fields";

export const courseSchema = yup.object().shape({
	name: yup.string().required(),
	begin_date: yup.date().required(),
	end_date: yup.date().required(),
});
export type CouseSchema = yup.InferType<typeof courseSchema>;

export interface DialogFormProps
	extends Pick<DialogProps, "open" | "onOpenChange"> {}

export const DialogForm: FC<PropsWithChildren<DialogFormProps>> = ({
	open,
	onOpenChange,
	children,
}) => {
	const form = useForm<CouseSchema>({
		resolver: yupResolver(courseSchema),
	});
	const { mutate, isLoading } = useMutation({
		mutationFn: createCourse,
		onSuccess: () => {
			onOpenChange?.(false);
			form.reset();
			toast.success("Course created successfully");
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			toast.error(error?.message || "Unable to create course");
		},
	});
	const { handleSubmit } = form;

	useEffect(() => {
		// reset form when dialog is closed
		if (!open) form.reset();
	}, [open]);

	const onSubmit = useCallback(
		(data: CouseSchema) => {
			const formattedData = {
				...data,
				begin_date: format(data.begin_date, "yyyy-MM-dd"),
				end_date: format(data.end_date, "yyyy-MM-dd"),
			};
			mutate(formattedData);
		},
		[mutate],
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Course</DialogTitle>
					<DialogDescription>
						Enter the details of the new course here. Click save when you're
						done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						id="create-course-form"
						className="mt-4 flex flex-col gap-4"
						onSubmit={handleSubmit(onSubmit)}
					>
						<FormFields />
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit" form="create-course-form">
						{isLoading ? <Loader2 className="animate-spin" /> : "Save Course"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
