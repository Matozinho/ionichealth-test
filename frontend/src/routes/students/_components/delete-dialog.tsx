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
import { deleteStudent } from "../_services/delete-student";

export interface DeleteDialogProps
	extends Pick<DialogProps, "open" | "onOpenChange"> {
	studentId: string | null;
}

export const DeleteDialog: FC<DeleteDialogProps> = ({
	open,
	onOpenChange,
	studentId,
}) => {
	const { mutate, isLoading } = useMutation({
		mutationFn: async (id: string) => await deleteStudent(id),
		onSuccess: () => {
			onOpenChange?.(false);
			toast.success("student deleted successfully");
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			toast.error(error?.message || "Unable to delete student");
		},
	});

	const handleDelete = useCallback(async () => {
		if (studentId) {
			mutate(studentId);
		}
	}, [studentId, mutate]);

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						Student.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						{isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
