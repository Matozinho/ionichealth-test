import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type FC, useCallback } from "react";
import { toast } from "sonner";
import {
	type DisenrollStudentParams,
	disenrollStudent,
} from "../_services/disenroll-student";

export interface DisenrollDialogProps
	extends Pick<DialogProps, "open" | "onOpenChange"> {
	studentId: string | null;
	courseId: string | null;
}

export const DisenrollDialog: FC<DisenrollDialogProps> = ({
	open,
	onOpenChange,
	studentId,
	courseId,
}) => {
	const { mutate, isLoading } = useMutation({
		mutationFn: async (params: DisenrollStudentParams) =>
			await disenrollStudent(params),
		onSuccess: () => {
			onOpenChange?.(false);
			toast.success("Studend disenrolled successfully");
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			console.error(error);
			toast.error(
				error?.response?.data?.error ||
					error?.message ||
					"Unable to disenroll student",
			);
		},
	});

	const handleDelete = useCallback(async () => {
		if (studentId && courseId) {
			mutate({ studentId, courseId });
		}
	}, [studentId, courseId, mutate]);

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription>
					This action will disenroll the student from the course.
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						{isLoading ? <Loader2 className="animate-spin" /> : "Disenroll"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
