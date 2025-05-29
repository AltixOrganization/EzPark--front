//import './App.css'
import GoogleMapComponent from "./app/public/pages/home/components/GoogleMapComponent.tsx";
import Header from "./app/public/components/header.tsx";
import UserGaragesList from "./app/EzPark/garages/components/UserGaragesList.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PublishGarage from "./app/EzPark/garages/components/PublishGarage.tsx";

function App() {

  return (
      <div className="App">
          <Header />

          <Routes>
              <Route path="/" element={<GoogleMapComponent />} />
              <Route path="/user-garages" element={<UserGaragesList />} />
              <Route path="/publish-garage" element={<PublishGarage />} />

              {/* Agrega otras rutas según sea necesario */}
          </Routes>
      </div>
  )
}

export default App
