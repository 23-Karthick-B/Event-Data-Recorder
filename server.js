const express = require("express");
const fs = require("fs");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname));

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;

const CSV_PATH = path.join(__dirname, "blackbox_data.csv");


app.post("/store-log", async (req, res) => {
  const line = req.body.log;

  if (!line) {
    return res.status(400).json({ success: false, msg: "No log data received" });
  }

  try {
    // Append the log line to CSV
    fs.appendFileSync(CSV_PATH, line + "\n");

    console.log("Log stored:", line);

    const parts = line.split(",");

    const latestJson = {
      time: {
        ist: parts[0],
        tick_ms: parts[1]
      },
      vehicle: {
        speed_kph: parts[2],
        distance_m: parts[3],
        steer_deg: parts[4],
        accel_during_turn_mps2: parts[12]
      },
      indicators: {
        left: parts[5],
        right: parts[6],
        brake: parts[7]
      },
      gps: {
        lat: parts[8],
        lon: parts[9],
        sog_kph: parts[10],
        fix: parts[11]
      },
      rmc_line: (parts[13] ?? "").replace(/,$/, "")
    };


    try {
      await axios.post(
        `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/latest-event/data`,
        { value: JSON.stringify(latestJson) },
        { headers: { "X-AIO-Key": AIO_KEY } }
      );
      console.log("Uploaded latest event to Adafruit");
    } catch (err) {
      console.log("Error uploading latest event:", err.response?.data || err.message);
    }


    return res.json({ success: true });

  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "game.html"));
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Using AIO username:", AIO_USERNAME);
});
