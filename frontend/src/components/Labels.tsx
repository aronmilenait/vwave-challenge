/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from "react";
import { VWAVE_API } from "./ShippingLocation";
import axios from "axios";
import { Label } from "../interfaces/labelInterface";

const Labels = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(VWAVE_API);
        const data = response.data;
        if (Array.isArray(data.labels)) {
          setLabels(data.labels);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch {
        setError("Error fetching labels");
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, []);

  const handleDownload = (b64: string, fileName: string) => {
    const pdfBlob = new Blob(
      [Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))],
      { type: "application/pdf" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `${fileName}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <section
      id="labels-section"
      className="bg-cyan-800 text-cyan-50 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">Labels</h2>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}
        {error && (
          <div
            className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {!loading && !error && labels.length === 0 && (
          <p className="text-center text-xl">
            No labels found. Create a shipping label to get started!
          </p>
        )}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {labels.map((label) => (
            <li
              key={label._id}
              className="bg-cyan-900 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Label {label._id.slice(-6)}
                </h3>
                <p className="text-cyan-200 mb-1">Format: {label.fileFormat}</p>
                <p className="text-cyan-200 mb-4">
                  Print Format: {label.printFormat}
                </p>
                <button
                  onClick={() =>
                    handleDownload(label.b64, `label_${label._id}`)
                  }
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-cyan-900 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Download PDF
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Labels;
