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
import { useCallback, type FC } from "react";
import { toast } from "sonner";
import { deleteCourse } from "../_services/delete-course";

export interface DeleteDialogProps
	extends Pick<DialogProps, "open" | "onOpenChange"> {
	courseId: string | null;
}

export const DeleteDialog: FC<DeleteDialogProps> = ({
	open,
	onOpenChange,
	courseId,
}) => {
	const { mutate, isLoading } = useMutation({
		mutationFn: async (id: string) => await deleteCourse(id),
		onSuccess: () => {
			onOpenChange?.(false);
			toast.success("Course deleted successfully");
		},
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onError: (error: any) => {
			toast.error(error?.message || "Unable to delete course");
		},
	});

	const handleDelete = useCallback(async () => {
		if (courseId) {
			mutate(courseId);
		}
	}, [courseId, mutate]);

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						course.
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
