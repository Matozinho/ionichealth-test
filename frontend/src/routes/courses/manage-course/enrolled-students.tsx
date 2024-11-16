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
import { format } from "date-fns";
import { Bolt, EllipsisVertical, Unlink } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DisenrollDialog } from "../_components/disenroll-dialog";
import { fetchCourseStudents } from "../_services/fetch-course-students";

export const EnrolledStudents = () => {
	const { courseId } = useParams();
	const [disenrollDialogOpen, setDisenrollDialogOpen] = useState(false);
	const [disenrollStudentId, setDisenrollStudentId] = useState<null | string>(
		null,
	);

	const {
		data: students,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: [`course-${courseId}-students`],
		queryFn: async () => await fetchCourseStudents(courseId),
	});

	const handleDisenroll = useCallback((courseId: string) => {
		setDisenrollStudentId(courseId);
		setDisenrollDialogOpen(true);
	}, []);

	const handleDisenrollDialogClose = useCallback(
		(open: boolean) => {
			setDisenrollStudentId(null);
			setDisenrollDialogOpen(open);
			refetch();
		},
		[refetch],
	);

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Cellphone</TableHead>
						<TableHead>Enrollment date</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<Skeleton className="w-full h-12" />
					) : (
						students?.map((student) => (
							<TableRow key={student.id}>
								<TableCell className="font-medium">{student.name}</TableCell>
								<TableCell>{student.email}</TableCell>
								<TableCell>{student.cellphone}</TableCell>
								<TableCell>{format(student.enrollment_date, "PPP")}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="icon">
												<EllipsisVertical />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<Link to={`/students/${student.id}`}>
												<DropdownMenuItem className="flex gap-1 items-center">
													<Bolt size={16} /> Manage
												</DropdownMenuItem>
											</Link>
											<DropdownMenuItem
												onClick={() => handleDisenroll(student.id)}
												className="flex gap-1 items-center"
											>
												<Unlink size={16} />
												Disenroll
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			<DisenrollDialog
				open={disenrollDialogOpen}
				onOpenChange={handleDisenrollDialogClose}
				studentId={disenrollStudentId}
				courseId={courseId ?? null}
			/>
		</>
	);
};
