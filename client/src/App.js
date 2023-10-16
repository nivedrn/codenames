import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NoMatch from "./components/NoMatch";
import AuthView from "./views/Auth/AuthView";
import HomeView from "./views/Home/HomeView";
import ProfileView from "./views/Profile/ProfileView";
import Players from "./views/Profile/Players/PlayersView";
import Settings from "./views/Profile/Settings/SettingsView";
import Room from "./views/Room/RoomView";
import ProtectedRoute from "./components/ProtectedRoute";
import "./assets/css/app.css";

export default function App() {
	return (
		<div className="App">
			<Navbar />
			<Routes>
				<Route path="/" element={<HomeView />}></Route>
				<Route path="/auth">
					<Route index element={<AuthView />}></Route>
					<Route path=":action">
						<Route index element={<AuthView />}></Route>
						<Route path=":roomId" element={<AuthView />}></Route>
					</Route>
				</Route>

				<Route
					path="/profile"
					element={
						<ProtectedRoute isAdmin={false}>
							<ProfileView />
						</ProtectedRoute>
					}
				>
					<Route
						index
						element={
							<ProtectedRoute isAdmin={false}>
								<Settings />
							</ProtectedRoute>
						}
					></Route>
					<Route
						path="settings"
						element={
							<ProtectedRoute isAdmin={false}>
								<Settings />
							</ProtectedRoute>
						}
					></Route>
					<Route
						path="players"
						element={
							<ProtectedRoute isAdmin={true}>
								<Players />
							</ProtectedRoute>
						}
					></Route>
				</Route>

				<Route path="/room/:roomId" element={<Room />} />
				<Route path="*" element={<NoMatch />} />
			</Routes>
			<Footer />
		</div>
	);
}
