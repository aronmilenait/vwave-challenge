/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import axios from "axios";

const GEOAPY_URL = `${import.meta.env.VITE_GEOAPIFY}`;
export const VWAVE_URL = `${import.meta.env.VITE_VWAVE_URL}`;

const ShippingLocation = () => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<
    { properties: { formatted: string } }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocation(query);

    if (query) {
      axios
        .get(GEOAPY_URL, {
          params: {
            text: query,
            apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
            filter: "countrycode:de",
          },
        })
        .then((response) => setSuggestions(response.data.features || []))
        .catch(() => {
          console.log(
            "There was a problem with your request. Please try again.",
          );
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!location) {
      setError("Please enter a location");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(VWAVE_URL, { location });
      console.log("Label created:", response.data);
      setSuccessMessage("Label created successfully!");
    } catch {
      console.log("There was a problem with your label. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="shipping-location"
      className="container mx-auto px-6 py-16 bg-cyan-800 text-cyan-50"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Where to ship?</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={location}
            onChange={handleChange}
            placeholder="Enter your location"
            className="flex-grow px-4 py-2 rounded-full text-cyan-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-cyan-900 font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading || !location}
          >
            {loading ? "Creating Label..." : "Create Label"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 text-green-500 text-center">
          <p>{successMessage}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <ul className="bg-cyan-700 rounded-lg shadow-lg overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-cyan-600 cursor-pointer transition duration-300 ease-in-out"
                onClick={() => setLocation(suggestion.properties.formatted)}
              >
                {suggestion.properties.formatted}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShippingLocation;
