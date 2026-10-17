import { createContext, useContext, useState } from "react";

const CityContext = createContext(null);

const DEFAULT_CITY = "Bhubaneswar";

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("city") || DEFAULT_CITY
  );

  const changeCity = (city) => {
    setSelectedCity(city);
    localStorage.setItem("city", city);
  };

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        changeCity
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);

  if (!context) {
    throw new Error(
      "useCity must be used inside CityProvider"
    );
  }

  return context;
}