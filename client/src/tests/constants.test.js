import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { SERVER_HOST, SERVER_PORT } from "../constants/apiConstants";

afterEach(() => {
    cleanup();
});

describe("Test Constants", () => {
	test("Global Constants", () => {
		expect(SERVER_HOST).toBe('http://localhost:8080');
		expect(SERVER_PORT).toBe(8080);
	});
});
