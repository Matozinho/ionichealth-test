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
import { Edit, EllipsisVertical, Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteDialog } from "./_components/delete-dialog";
import { DialogForm } from "./_components/dialog-form";
import { fetchStudents } from "./_services/fetch-students";

export const StudentsPage = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [deleteStudentId, setDeleteStudentId] = useState<null | string>(null);
	const {
		isLoading,
		data: students,
		refetch,
	} = useQuery({
		queryKey: ["students"],
		queryFn: async () => await fetchStudents(),
	});

	const onOpenChange = (state: boolean) => {
		setIsDialogOpen(state);
		refetch();
	};

	const handleDeleteDialogClose = useCallback(
		(open: boolean) => {
			setDeleteStudentId(null);
			setOpenDelete(open);
			refetch();
		},
		[refetch],
	);

	const handleDelete = useCallback((studentId: string) => {
		setDeleteStudentId(studentId);
		setOpenDelete(true);
	}, []);

	return (
		<div className="flex flex-col w-full h-full">
			<section className="flex justify-between">
				<h2 className="text-lg font-medium">Students list</h2>
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
						<TableHead>CPF</TableHead>
						<TableHead>E-mail</TableHead>
						<TableHead>Cellphone</TableHead>
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
								<TableCell>{student.cpf}</TableCell>
								<TableCell>{student.email}</TableCell>
								<TableCell>{student.cellphone}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="icon">
												<EllipsisVertical />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<Link to={student.id}>
												<DropdownMenuItem className="flex gap-1 items-center">
													<Edit size={16} /> Edit
												</DropdownMenuItem>
											</Link>
											<DropdownMenuItem
												onClick={() => handleDelete(student.id)}
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
				open={openDelete}
				onOpenChange={handleDeleteDialogClose}
				studentId={deleteStudentId}
			/>
		</div>
	);
};
