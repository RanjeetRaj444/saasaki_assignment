const Stock = require("../models/stockModel");
const fs = require("fs");
const csv = require("csv-parser");

const validateRow = (row) => {
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(row.Date)) return false;

	const numericFields = [
		"Prev Close",
		"Open",
		"High",
		"Low",
		"Last",
		"Close",
		"VWAP",
		"Volume",
		"Turnover",
		"Trades",
		"Deliverable",
		"%Deliverable",
	];

	for (const field of numericFields) {
		if (isNaN(parseFloat(row[field]))) {
			return false;
		}
	}

	return true;
};

const formatRow = (row) => {
	return {
		date: row.Date,
		symbol: row.Symbol,
		series: row.Series,
		prev_close: parseFloat(row["Prev Close"]),
		open: parseFloat(row.Open),
		high: parseFloat(row.High),
		low: parseFloat(row.Low),
		last: parseFloat(row.Last),
		close: parseFloat(row.Close),
		vwap: parseFloat(row.VWAP),
		volume: parseInt(row.Volume, 10),
		turnover: parseFloat(row.Turnover),
		trades: parseInt(row.Trades, 10),
		deliverable: parseInt(row.Deliverable, 10),
		percent_deliverable: parseFloat(row["%Deliverable"]),
	};
};

exports.uploadStockData = async (req, res) => {
	const filePath = req.file.path;

	let totalRecords = 0;
	let successfulRecords = 0;
	const failedRecords = [];

	try {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", async (row) => {
				totalRecords++;

				if (validateRow(row)) {
					const stockData = formatRow(row);
					await Stock.create(stockData);
					successfulRecords++;
				} else {
					failedRecords.push({ row, reason: "Invalid data format" });
				}
			})
			.on("end", () => {
				fs.unlinkSync(filePath);

				return res.json({
					total_records: totalRecords,
					successful_records: successfulRecords,
					failed_records: failedRecords.length,
					failed_records_details: failedRecords,
				});
			})
			.on("error", (error) => {
				return res.status(500).json({ error: "Failed to process CSV file." });
			});
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred during file processing." });
	}
};

exports.getHighestVolume = async (req, res) => {
	const { start_date, end_date, symbol } = req.query;

	try {
		const query = {
			date: { $gte: new Date(start_date), $lte: new Date(end_date) },
		};
		if (symbol) {
			query.symbol = symbol;
		}

		const highestVolumeRecord = await Stock.find(query)
			.sort({ volume: -1 })
			.limit(1);

		if (highestVolumeRecord.length === 0) {
			return res
				.status(404)
				.json({ message: "No records found for the given parameters." });
		}

		return res.json({
			highest_volume: {
				date: highestVolumeRecord[0].date,
				symbol: highestVolumeRecord[0].symbol,
				volume: highestVolumeRecord[0].volume,
			},
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred while retrieving data." });
	}
};

exports.getAverageClose = async (req, res) => {
	const { start_date, end_date, symbol } = req.query;

	try {
		const query = {
			date: { $gte: new Date(start_date), $lte: new Date(end_date) },
			...(symbol && { symbol }),
		};

		const averageClose = await Stock.aggregate([
			{ $match: query },
			{
				$group: {
					_id: null,
					average_close: { $avg: "$close" },
				},
			},
		]);

		if (averageClose.length === 0) {
			return res
				.status(404)
				.json({ message: "No records found for the given parameters." });
		}

		return res.json({
			average_close: averageClose[0].average_close,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred while calculating average close." });
	}
};

exports.getAverageVWAP = async (req, res) => {
	const { start_date, end_date, symbol } = req.query;

	try {
		const query = {
			date: { $gte: new Date(start_date), $lte: new Date(end_date) },
			...(symbol && { symbol }),
		};

		const averageVWAP = await Stock.aggregate([
			{ $match: query },
			{
				$group: {
					_id: null,
					average_vwap: { $avg: "$vwap" },
				},
			},
		]);

		if (averageVWAP.length === 0) {
			return res
				.status(404)
				.json({ message: "No records found for the given parameters." });
		}

		return res.json({
			average_vwap: averageVWAP[0].average_vwap,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: "An error occurred while calculating average VWAP." });
	}
};
