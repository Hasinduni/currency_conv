import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Mainpage() {
  const [date, setDate] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [amountInSourceCurrency, setAmountInSourceCurrency] = useState(0);
  const [amountInTargetCurrency, setAmountInTargetCurrency] = useState(null);
  const [currencyNames, setCurrencyNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Handle errors

  // Fetch all currency names on component mount
  useEffect(() => {
    const getCurrencyNames = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getAllCurrencies");
        setCurrencyNames(
          Object.entries(response.data).map(([code, name]) => ({ code, name }))
        );
      } catch (err) {
        console.error("Error fetching currencies:", err);
        setError("Failed to fetch currency names. Please try again.");
      }
    };
    getCurrencyNames();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAmountInTargetCurrency(null);
    setError(null); // Reset previous errors

    try {
      const response = await axios.get("http://localhost:5000/convert", {
        params: {
          date,
          sourceCurrency,
          targetCurrency,
          amountInSourceCurrency,
        },
      });

      setAmountInTargetCurrency(response.data.targetAmount); // Store result
    } catch (err) {
      console.error("Error during conversion:", err);
      setError("Conversion failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="lg:mx-32 text-5xl font-bold text-green-500">
        Convert Your Currencies Today
      </h1>

      <p className="lg:mx-32 opacity-40 py-6">
        Welcome to "Convert Your Currencies Today"! This application allows you
        to easily convert currencies based on the latest exchange rates. Whether
        you're planning a trip, managing your finances, or simply curious about
        the value of your money in different currencies, this tool is here to
        help.
      </p>

      <div className="mt-5 flex items-center justify-center flex-col">
        <section className="w-full lg:w-1/2">
          <form onSubmit={handleSubmit}>
            {/* Date Input */}
            <div className="mb-5">
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-green">
                Date
              </label>
              <input
                onChange={(e) => setDate(e.target.value)}
                type="date"
                id="date"
                name="date"
                className="bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                required
              />
            </div>

            {/* Source Currency Selector */}
            <div className="mb-5">
              <label htmlFor="sourceCurrency" className="block mb-2 text-sm font-medium text-green">
                Source Currency
              </label>
              <select
                onChange={(e) => setSourceCurrency(e.target.value)}
                id="sourceCurrency"
                name="sourceCurrency"
                className="bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                required
              >
                <option value="">Select your currency</option>
                {currencyNames.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Currency Selector */}
            <div className="mb-5">
              <label htmlFor="targetCurrency" className="block mb-2 text-sm font-medium text-green">
                Target Currency
              </label>
              <select
                onChange={(e) => setTargetCurrency(e.target.value)}
                id="targetCurrency"
                name="targetCurrency"
                className="bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                required
              >
                <option value="">Select target currency</option>
                {currencyNames.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="mb-5">
              <label htmlFor="amountInSourceCurrency" className="block mb-2 text-sm font-medium text-green">
                Amount in Source Currency
              </label>
              <input
                onChange={(e) => setAmountInSourceCurrency(Number(e.target.value))}
                type="number"
                id="amountInSourceCurrency"
                name="amountInSourceCurrency"
                className="bg-gray-800 text-gray-100 text-sm rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? "Converting..." : "Get the Target Currency"}
            </button>
          </form>
        </section>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-5 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Conversion Result */}
      {amountInTargetCurrency !== null && !error && (
        <div className="mt-5 text-center">
          <p className="text-2xl font-bold text-green-500">
            Target Amount: {amountInTargetCurrency} {targetCurrency}
          </p>
        </div>
      )}
    </div>
  );
}
