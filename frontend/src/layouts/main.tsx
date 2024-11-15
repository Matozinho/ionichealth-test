import { AppSidebar } from "@/components/app-sidebar";
import { sidebarPages } from "@/constants";
import { Outlet, useLocation } from "react-router-dom";

export const MainLayout = () => {
	const currentRoute = useLocation();
	const currentPage = sidebarPages.find((page) =>
		currentRoute.pathname.includes(page.href),
	)?.name;

	return (
		<div className="flex h-screen w-full">
			<div className="flex w-full">
				<AppSidebar />
				<section className="w-full">
					<header className="flex items-center justify-between px-6 py-4 bg-white border-b">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold">{currentPage}</h1>
						</div>
					</header>
					<main className="flex w-full overflow-auto p-8">
						<Outlet />
					</main>
				</section>
			</div>
		</div>
	);
};
