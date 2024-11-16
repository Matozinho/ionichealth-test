import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Providers } from "./components/providers";
import { MainLayout } from "./layouts/main";
import { CoursesPage } from "./routes/courses";
import { EditCoursePage } from "./routes/courses/edit-course";
import { DashboardPage } from "./routes/dashboard";
import { EnrollmentsPage } from "./routes/enrollments";
import { StudentsPage } from "./routes/students";
import { EditStudentPage } from "./routes/students/edit-student";

function App() {
	return (
		<Providers>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainLayout />}>
						<Route path="dashboard">
							<Route index element={<DashboardPage />} />
						</Route>
						<Route path="courses">
							<Route index element={<CoursesPage />} />
							<Route path=":courseId" element={<EditCoursePage />} />
						</Route>
						<Route path="students">
							<Route index element={<StudentsPage />} />
							<Route path=":studentId" element={<EditStudentPage />} />
						</Route>
						<Route path="enrollments" element={<EnrollmentsPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Providers>
	);
}

export default App;
