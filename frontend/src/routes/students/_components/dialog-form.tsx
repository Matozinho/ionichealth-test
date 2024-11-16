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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createStudent } from "../_services/create-student";
import { FormFields } from "./form-fields";

export const studentSchema = yup.object().shape({
	name: yup.string().required(),
	cpf: yup.string().required(),
	email: yup.string().required(),
	cellphone: yup.string().required(),
	courses: yup.array().of(yup.string().required()).required().min(1),
});
export type StudentSchema = yup.InferType<typeof studentSchema>;

export interface DialogFormProps
	extends Pick<DialogProps, "open" | "onOpenChange"> {}

export const DialogForm: FC<PropsWithChildren<DialogFormProps>> = ({
	open,
	onOpenChange,
	children,
}) => {
	const form = useForm<StudentSchema>({
		resolver: yupResolver(studentSchema),
	});
	const { mutate, isLoading } = useMutation({
		mutationFn: createStudent,
		onSuccess: () => {
			onOpenChange?.(false);
			form.reset();
			toast.success("Student created successfully");
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			toast.error(error?.message || "Unable to create tudent");
		},
	});
	const { handleSubmit } = form;

	useEffect(() => {
		// reset form when dialog is closed
		if (!open) form.reset();
	}, [open]);

	const onSubmit = useCallback(
		(data: StudentSchema) => {
			mutate(data);
		},
		[mutate],
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Student</DialogTitle>
					<DialogDescription>
						Enter the student data and select a course to create a new student
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						id="create-student-form"
						className="mt-4 flex flex-col gap-4"
						onSubmit={handleSubmit(onSubmit)}
					>
						<FormFields />
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit" form="create-student-form">
						{isLoading ? <Loader2 className="animate-spin" /> : "Save Student"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
