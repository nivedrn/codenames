const app = require("../server"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);

describe("Test Server Controllers", () => {
	// This passes because 1 === 1
	it("Testing to see if Jest works", () => {
		expect(1).toBe(1);
	});

	describe("GameController Frunctions", () => {
		it("GET /", async () => {
			// Sends GET Request to /test endpoint
			const res = await request.get("/");
			expect(res.status).toBe(200);
			expect(res.text).toEqual("Initialized!");
			// ...
		});
	});
});