const app = require("../server"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);

describe("Test Server Routes", () => {
	// This passes because 1 === 1
	it("Testing to see if Jest works", () => {
		expect(1).toBe(1);
	});

	describe("Index Routes", () => {
		it("GET /", async () => {
			// Sends GET Request to /test endpoint
			const res = await request.get("/");
			expect(res.status).toBe(200);
			expect(res.text).toEqual("Initialized!");
			// ...
		});
	});

	describe("Game Routes", () => {
        let roomId = "ffffff";
		it("GET /game/newroom", async () => {
			// Sends GET Request to /test endpoint
			const { body, statusCode } = await request.get("/game/newroom");
			expect(statusCode).toBe(200);
			expect(body.roomId).toMatch(new RegExp(/([a-z0-9]){6}/));
            roomId = body.roomId;
			// ...
		});
        
		it("GET /game/fetchRoomDetails/:roomId", async () => {
			// Sends GET Request to /test endpoint
			const { body, statusCode } = await request.get("/game/fetchRoomDetails/" + roomId);
			expect(statusCode).toBe(200);
			// ...
		});

		it("GET /game/fetchWordPacks", async () => {
			// Sends GET Request to /test endpoint
			const { body, statusCode } = await request.get("/game/fetchWordPacks");
			expect(statusCode).toBe(200);
			// ...
		});
        
	});

});
