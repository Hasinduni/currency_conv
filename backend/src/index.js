const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(cors());

// Route to convert currencies
app.get("/convert", async (req, res) => {
  const { date, sourceCurrency, targetCurrency, amountInSourceCurrency } = req.query;

  // Validate required query parameters
  if (!date || !sourceCurrency || !targetCurrency || !amountInSourceCurrency) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  // Ensure `amountInSourceCurrency` is a valid number
  const amount = parseFloat(amountInSourceCurrency);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount in source currency" });
  }

  try {
    // Fetch historical exchange rates
    const dataUrl = `https://openexchangerates.org/api/historical/${date}.json?app_id=a3dbeff32cec47bbb4451089f00253fd`;
    const dataResponse = await axios.get(dataUrl);

    // Extract exchange rates
    const rates = dataResponse.data.rates;
    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];

    // Check if rates are valid
    if (!sourceRate || !targetRate) {
      return res.status(400).json({
        error: `Invalid currency codes or rates not available for ${sourceCurrency} or ${targetCurrency}`,
      });
    }

    // Calculate the target amount
    const targetAmount = (targetRate / sourceRate) * amount;

    // Send a success response
    return res.json({
      date,
      sourceCurrency,
      targetCurrency,
      amountInSourceCurrency: amount,
      targetAmount: parseFloat(targetAmount.toFixed(2)),
    });
  } catch (err) {
    console.error("Error fetching conversion data:", err.message);
    return res.status(500).json({ error: "Failed to fetch conversion data" });
  }
});

// Route to fetch all currency names
app.get("/getAllCurrencies", async (req, res) => {
  const nameURL = "https://openexchangerates.org/api/currencies.json?app_id=a3dbeff32cec47bbb4451089f00253fd";

  try {
    const namesResponse = await axios.get(nameURL);
    const nameData = namesResponse.data; // Response is an object of key-value pairs
    return res.json(nameData);
  } catch (err) {
    console.error("Error fetching currencies:", err.message);
    return res.status(500).json({ error: "Failed to fetch currencies" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("SERVER STARTED on http://localhost:5000");
});
