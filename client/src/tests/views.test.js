import "@testing-library/jest-dom";
import { screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../views/Home/HomeView";
import Room from "../views/Room/RoomView";

import { renderWithProviders } from "./utils/utilsForTests";

afterEach(() => {
    cleanup();
});


describe("Test Views", () => {
    it("Testing to see if Jest works", () => {
		expect(1).toBe(1);
	});

	test("Home View", () => {
		renderWithProviders(
			<BrowserRouter>
				<Home />
			</BrowserRouter>
		);

		const mainElement = screen.getByTestId("homeContent");
		expect(mainElement).toBeInTheDocument();
		expect(mainElement).toHaveTextContent("CODENAMES");
	});

	test("Room View", () => {
		renderWithProviders(
			<BrowserRouter>
				<Room />
			</BrowserRouter>
		);

		const mainElement = screen.getByTestId("roomContent");
		expect(mainElement).toBeInTheDocument();
		expect(mainElement).toHaveTextContent("Team Blue");
		expect(mainElement).toHaveTextContent("Team Red");
	});

	// test("Login View", () => {
	// 	renderWithProviders(
	// 		<BrowserRouter>
	// 			<Auth />
	// 		</BrowserRouter>
	// 	);

	// 	const mainElement = screen.getByTestId("authContent");
	// 	expect(mainElement).toBeInTheDocument();
	// 	expect(mainElement).toHaveTextContent("Login");
	// });
});
