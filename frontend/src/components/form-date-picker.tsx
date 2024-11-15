import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type {
	ControllerRenderProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface FormFieldWrapperProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> {
	label: string;
	field: ControllerRenderProps<TFieldValues, TName>;
}

export const FormDatePicker = <
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
>({
	label,
	field,
}: FormFieldWrapperProps<TFieldValues, TName>) => {
	return (
		<FormItem className="flex flex-col">
			<FormLabel>{label}</FormLabel>
			<Popover>
				<PopoverTrigger asChild>
					<FormControl>
						<Button
							variant={"outline"}
							className={cn(
								"w-full pl-3 text-left font-normal",
								!field.value && "text-muted-foreground",
							)}
						>
							{field.value ? (
								format(field.value, "PPP")
							) : (
								<span>Pick a date</span>
							)}
							<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={field.value}
						onSelect={field.onChange}
						disabled={(date) => date < new Date()}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<FormMessage />
		</FormItem>
	);
};
