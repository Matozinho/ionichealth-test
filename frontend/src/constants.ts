import { Book, GraduationCap, LayoutDashboard, Users } from "lucide-react";

export const sidebarPages = [
	{ name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
	{ name: "Courses", icon: Book, href: "/courses" },
	{ name: "Students", icon: GraduationCap, href: "/students" },
	{ name: "Enrollments", icon: Users, href: "/enrollments" },
];
