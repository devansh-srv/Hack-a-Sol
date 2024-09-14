import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SelectTeam from './components/SelectTeam.jsx'
import Player from './components/Player.jsx'


const App = () => {

  return(
    <Router>
      <Routes>
        <Route path = "/" element={<p>hi</p>}></Route>
        <Route path = "/selectteam" element={<SelectTeam />}></Route>
        <Route path = "/player" element={<Player />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
