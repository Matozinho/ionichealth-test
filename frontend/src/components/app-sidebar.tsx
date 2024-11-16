import { sidebarPages } from "@/constants";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export const AppSidebar = () => {
	const currentRoute = useLocation();

	return (
		<aside className="max-w-52 flex w-full flex-col border-r">
			<header className="border-b px-2 py-4">
				<h2 className="px-4 text-lg font-semibold">Admin Dashboard</h2>
			</header>
			<section>
				{sidebarPages.map((page) => (
					<Link
						className={cn(
							"flex gap-1 items-center px-2 py-1 hover:bg-gray-100 transition duration-300 ease-in-out text-sm",
							currentRoute.pathname.includes(page.href) &&
								"bg-gray-100 font-medium",
						)}
						to={page.href}
						key={page.name}
					>
						<page.icon className="mr-2 h-4 w-4" />
						{page.name}
					</Link>
				))}
			</section>
		</aside>
	);
};
