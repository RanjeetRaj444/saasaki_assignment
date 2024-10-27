const { validateRow, formatRow } = require("../controllers/stockController");

describe("Validation Logic", () => {
	test("Valid row should return true", () => {
		const row = {
			Date: "2024-01-01",
			Symbol: "ULTRACEMCO",
			Series: "EQ",
			"Prev Close": "10.0",
			Open: "305.0",
			High: "340.0",
			Low: "253.25",
			Last: "259.0",
			Close: "260.0",
			VWAP: "268.8",
			Volume: "6633956",
			Turnover: "1.78E14",
			Trades: "133456",
			Deliverable: "970249",
			"%Deliverable": "0.1463",
		};
		expect(validateRow(row)).toBe(true);
	});

	test("Invalid date should return false", () => {
		const row = {
			Date: "invalid-date",
			Symbol: "ULTRACEMCO",
		};
		expect(validateRow(row)).toBe(false);
	});
});
