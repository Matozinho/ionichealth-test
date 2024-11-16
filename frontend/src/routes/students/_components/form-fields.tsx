import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

import { MultiSelect } from "@/components/ui/multi-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourses } from "@/routes/courses/_services/fetch-courses";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import type { StudentSchema } from "./dialog-form";

export const FormFields: FC<{ isEditing?: boolean }> = ({ isEditing }) => {
	const form = useFormContext<StudentSchema>();
	const { data, isLoading } = useQuery({
		queryKey: ["courses"],
		queryFn: async () => await fetchCourses(),
	});
	const coursesOptions =
		data?.map((course) => ({
			label: course.name,
			value: course.id,
		})) || [];

	return (
		<>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="cpf"
				render={({ field }) => (
					<FormItem>
						<FormLabel>CPF</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="email"
				render={({ field }) => (
					<FormItem>
						<FormLabel>E-mail</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="cellphone"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Cellphone</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{isEditing && !form.getValues("courses") ? (
				<Skeleton className="w-full h-12" />
			) : (
				<FormField
					control={form.control}
					name="courses"
					render={({ field }) =>
						isLoading ? (
							<Skeleton className="w-full h-12" />
						) : (
							<FormItem>
								<FormLabel>Courses</FormLabel>
								<FormControl>
									<MultiSelect
										{...field}
										defaultValue={field.value}
										onValueChange={(value) => {
											field.onChange(value);
										}}
										options={coursesOptions}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)
					}
				/>
			)}
		</>
	);
};
