# Stock Data API

## Overview

This project provides an API for uploading stock data in CSV format, validating it, storing it in MongoDB, and performing calculations.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Ensure MongoDB is running.
4. Start the server with `node server.js`.

## API Endpoints

- **Upload Stock Data**
  - `POST /api/upload`
  - Body: Form-data with a file field.
- **Get Highest Volume**
  - `GET /api/highest_volume?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **Get Average Close**
  - `GET /api/average_close?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&symbol=SYMBOL`
- **Get Average VWAP**
  - `GET /api/average_vwap?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&symbol=SYMBOL`

## Testing

Run tests with `npm test`.
