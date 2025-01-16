/* eslint-disable react/react-in-jsx-scope */
import "./App.css";
import Home from "./components/Home";
import Labels from "./components/Labels";
import ShippingLocation from "./components/ShippingLocation";

function App() {
  return (
    <main className="min-h-screen bg-cyan-800">
      <Home />
      <ShippingLocation />
      <Labels />
    </main>
  );
}

export default App;
