import React, { useState } from "react";
import "./App.css";
import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
} from "@material-ui/core";
import { useEffect } from "react";
import Infobox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log(countryCode);
    //https://disease.sh/v3/covid-19/countries/usa
    //https://disease.sh/v3/covid-19/all
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }
        setMapZoom(4);
      });
  };

  return (
    <div className="app__main">
      <div className="app__body">
        <div className="app">
          <div className="app__left">
            <div className="app__header">
              <h1>Covid-19 Tracker</h1>
              <FormControl className="app__dropdown">
                <Select
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.name} value={country.value}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="app__stats">
              <Infobox
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus Cases"
                total={prettyPrintStat(countryInfo.cases)}
                cases={prettyPrintStat(countryInfo.todayCases)}
                isRed
                casesType="cases"
                tooltip="Todays new cases"
              />
              <Infobox
                onClick={(e) => setCasesType("recovered")}
                active={casesType === "recovered"}
                title="Recovered"
                total={prettyPrintStat(countryInfo.recovered)}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                casesType="recovered"
                tooltip="Todays new recovered"
              />
              <Infobox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                active={casesType === "deaths"}
                total={prettyPrintStat(countryInfo.deaths)}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                isRed
                casesType="deaths"
                tooltip="Todays new deaths"
              />
            </div>
            <Map
              countries={mapCountries}
              casesType={casesType}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
          <Card
            className="app_right"
            raised={true}
            style={{ borderRadius: 15 }}
          >
            <CardContent>
              {/** Table */}
              <h2>Live Cases by Country</h2>
              <Table countries={tableData} />
              <h2 className="app__grapTitle">Worldwide new {casesType}</h2>
              <LineGraph casesType={casesType} className="app__graph" />
              {/** Graph */}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="app__footer"></div>
    </div>
  );
}

export default App;
