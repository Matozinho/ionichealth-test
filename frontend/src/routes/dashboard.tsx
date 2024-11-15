import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { sidebarPages } from "@/constants";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{sidebarPages.slice(1).map((page) => (
				<Link to={page.href} key={page.name}>
					<Card className="hover:bg-gray-50">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{page.name}</CardTitle>
							<page.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<CardDescription>
								Quick access to {page.name.toLowerCase()} management
							</CardDescription>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
};
