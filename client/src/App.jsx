import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Build from "./pages/Build";
import Bot from "./pages/Bot";
import BuildGame from "./pages/BuildGame";
import FreeStyle from "./pages/FreeStyle";
import War from "./pages/War";
import MarketPlace from "./pages/MarketPlace";
import AiAndWorld from "./pages/AiAndWorld";
import SelectingMap from "./pages/SelectingMap";
import Inbox from "./pages/Inbox";
import SelectMode from "./pages/SelectMode";
import SaleMap from "./pages/SaleMap";
import Settings from "./pages/Settings";
import GFHomePage from "./components/GFHomePage";

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build" element={<Build />} />
            <Route path="/bot" element={<Bot />} />
            <Route path="/build/buildgame" element={<BuildGame />} />
            <Route path="/build/freestyle" element={<FreeStyle />} />
            <Route path="/build/war" element={<War />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/AIvsWORLD" element={<AiAndWorld />} />
            <Route path="/selectmap" element={<SelectingMap />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/selectmode" element={<SelectMode />} />
            <Route path="/salemap" element={<SaleMap />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/virtualgirlfriend" element={<GFHomePage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
