import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Map from "./Components/Map.jsx";

function App() {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>OpenStreetMap with Vite</h2>
        <Map lat={31.4447} lng={74.2986} />
      </div>
    </>
  );
}

export default App;
