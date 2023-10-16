import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NoMatch from "../components/NoMatch";
import WordCard from "../components/WordCard";
import PlayerCard from "../components/PlayerCard";

import { renderWithProviders } from "./utils/utilsForTests";

afterEach(() => {
	cleanup();
});

describe("Test Components", () => {
	test("Navbar Component", () => {
		renderWithProviders(
			<BrowserRouter>
				<Navbar />
			</BrowserRouter>
		);

		const mainElement = screen.getByTestId("navbarContent");
		expect(mainElement).toBeInTheDocument();
		expect(mainElement).toHaveTextContent("CODENAMES");
	});

	test("Footer Component", () => {
		render(
			<BrowserRouter>
				<Footer />
			</BrowserRouter>
		);

		const mainElement = screen.getByTestId("footerContent");
		expect(mainElement).toBeInTheDocument();
		expect(mainElement).toHaveTextContent("terms of service");
	});

	test("NoMatch Component", () => {
		render(
			<BrowserRouter>
				<NoMatch />
			</BrowserRouter>
		);

		const mainElement = screen.getByTestId("noMatchContent");
		expect(mainElement).toBeInTheDocument();
		expect(mainElement).toHaveTextContent("Page not found");
	});

});
