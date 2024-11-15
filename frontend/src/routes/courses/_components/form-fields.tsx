import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

import { FormDatePicker } from "@/components/form-date-picker";
import type { CouseSchema } from "./dialog-form";

export const FormFields = () => {
	const form = useFormContext<CouseSchema>();

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
				name="begin_date"
				render={({ field }) => (
					<FormDatePicker label="Begin Date" field={field} />
				)}
			/>
			<FormField
				control={form.control}
				name="end_date"
				render={({ field }) => (
					<FormDatePicker label="End Date" field={field} />
				)}
			/>
		</>
	);
};
