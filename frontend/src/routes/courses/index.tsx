import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { Edit, EllipsisVertical, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteDialog } from "./_components/delete-dialog";
import { DialogForm } from "./_components/dialog-form";
import { fetchCourses } from "./_services/fetch-courses";

export const CoursesPage = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [openDelte, setOpenDelete] = useState(false);
	const [deleteCourseId, setDeleteCourseId] = useState<null | string>(null);
	const {
		isLoading,
		data: courses,
		refetch,
	} = useQuery({
		queryKey: ["courses"],
		queryFn: async () => await fetchCourses(),
	});

	const onOpenChange = (state: boolean) => {
		setIsDialogOpen(state);
		refetch();
	};

	const formatDateForLocale = useCallback((dateString: string) => {
		const date = parse(dateString, "yyyy-MM-dd", new Date());
		return format(date, "P");
	}, []);

	const handleDelete = useCallback((courseId: string) => {
		setDeleteCourseId(courseId);
		setOpenDelete(true);
	}, []);

	const handleDeleteDialogClose = useCallback(
		(open: boolean) => {
			setDeleteCourseId(null);
			setOpenDelete(open);
			refetch();
		},
		[refetch],
	);

	return (
		<div className="flex flex-col w-full h-full">
			<section className="flex justify-between">
				<h2 className="text-lg font-medium">Courses list</h2>
				<DialogForm open={isDialogOpen} onOpenChange={onOpenChange}>
					<Button size="icon">
						<Plus />
					</Button>
				</DialogForm>
			</section>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Begin Date</TableHead>
						<TableHead>End Date</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<Skeleton className="w-full h-12" />
					) : (
						courses?.map((course) => (
							<TableRow key={course.id}>
								<TableCell className="font-medium">{course.name}</TableCell>
								<TableCell>{formatDateForLocale(course.begin_date)}</TableCell>
								<TableCell>{formatDateForLocale(course.end_date)}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="icon">
												<EllipsisVertical />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuItem>
												<Link
													className="flex gap-1 items-center"
													to={course.id}
												>
													<Edit size={16} /> Edit
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleDelete(course.id)}
												className="flex gap-1 items-center"
											>
												<Trash2 size={16} />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<DeleteDialog
				open={openDelte}
				onOpenChange={handleDeleteDialogClose}
				courseId={deleteCourseId}
			/>
		</div>
	);
};
