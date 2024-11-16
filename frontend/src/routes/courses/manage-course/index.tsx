import * as TabsPrimitive from "@radix-ui/react-tabs";
import { EditCourse } from "./edit-course";
import { EnrolledStudents } from "./enrolled-students";

export const ManageCoursePage = () => {
	return (
		<section className="flex flex-col w-full items-center">
			<TabsPrimitive.Root className="w-full" defaultValue="students">
				<TabsPrimitive.List className="border-b">
					<TabsPrimitive.Trigger
						className="p-2 hover:bg-gray-200 transition-all duration-300 border-r data-[state=active]:bg-slate-100"
						value="students"
					>
						Students
					</TabsPrimitive.Trigger>
					<TabsPrimitive.Trigger
						className="p-2 hover:bg-gray-200 transition-all duration-300 data-[state=active]:bg-slate-100"
						value="form"
					>
						Edit course
					</TabsPrimitive.Trigger>
				</TabsPrimitive.List>
				<TabsPrimitive.Content value="students">
					<div className="flex w-full p-4 items-center justify-center">
						<EnrolledStudents />
					</div>
				</TabsPrimitive.Content>
				<TabsPrimitive.Content className="" value="form">
					<div className="flex w-full p-4 items-center justify-center">
						<EditCourse />
					</div>
				</TabsPrimitive.Content>
			</TabsPrimitive.Root>
		</section>
	);
};
