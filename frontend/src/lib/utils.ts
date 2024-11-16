import { type ClassValue, clsx } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatDateForLocale = (dateString: string) => {
	const date = parse(dateString, "yyyy-MM-dd", new Date());
	return format(date, "P");
};
