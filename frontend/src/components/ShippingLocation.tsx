/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import axios from "axios";
import { Suggestion } from "../interfaces/suggestionInterface";

export const GEOAPYFY_URL = `${import.meta.env.VITE_GEOAPIFY}`;
export const GEOAPYFY_API_KEY = `${import.meta.env.VITE_GEOAPIFY_API_KEY}`;
export const VWAVE_API = `${import.meta.env.VITE_VWAVE_API}`;

const ShippingLocation = () => {
  const [location, setLocation] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const [addressValidationMessage, setAddressValidationMessage] = useState<
    string | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocation(query);
    if (query) {
      axios
        .get(GEOAPYFY_URL, {
          params: {
            text: query,
            apiKey: GEOAPYFY_API_KEY,
            filter: "countrycode:de",
          },
        })
        .then((response) => {
          setSuggestions(response.data.features || []);
        })
        .catch(() => {
          console.log(
            "There was a problem with your request. Please try again.",
          );
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setLocation(suggestion.properties.formatted);
    const streetName = suggestion.properties.address_line1;
    setStreet(streetName);
    setPostalCode(suggestion.properties.postcode);
    setCity(suggestion.properties.city);
    setSuggestions([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!street || !postalCode || !city) {
      setAddressValidationMessage(
        "Please introduce an address before trying to create a label.",
      );
      return;
    }

    setAddressValidationMessage(null);
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const consigneeData = {
        street,
        postalCode,
        city,
        country: "DE",
      };

      await axios.post(VWAVE_API, consigneeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("Label created successfully!");
    } catch (error) {
      console.log(error);
      setError("There was a problem with your label. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="shipping-location"
      className="flex items-center justify-center px-4 py-12 text-cyan-50"
    >
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold mb-8 text-center">Where to ship?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={handleChange}
              placeholder="Enter your location"
              className="w-full px-4 py-3 rounded-lg text-cyan-900 bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-cyan-900 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-outd"
            disabled={loading}
          >
            {loading ? "Creating Label..." : "Create Label"}
          </button>
        </form>

        {addressValidationMessage && (
          <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
            <p className="text-yellow-200">{addressValidationMessage}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
            <p className="text-green-200">{successMessage}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-2">
            <ul className="bg-cyan-700 rounded-lg shadow-lg overflow-hidden divide-y divide-cyan-600">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-3 hover:bg-cyan-600 cursor-pointer transition duration-300 ease-in-out"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <span>{suggestion.properties.formatted}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingLocation;
