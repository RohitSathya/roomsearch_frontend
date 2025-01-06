import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Range } from "react-range";
import link from "../link";

const PropertySlider = ({ filters, setFilters }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();

  const cities = [
    "Chandigarh",
    "Mohali",
    "Kharar",
    "Zirakpur",
    "Sahibzada Ajit Singh Nagar",
    "Chandigarh University, Mohali",
    "Chandigarh University South Campus, Mohali",
    "Chitkara University, Chandigarh",
    "Panjab University, Chandigarh",
    "Lovely Professional University, Phagwara",
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${link}/api/property`);
        const data = await res.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  const handleSearch = () => {
    navigate("/properties", { state: { filters } });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePriceRangeChange = (values) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500/40 to-purple-600/40 p-4">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
          opacity: "0.2",
        }}
      />

      <Card className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-md shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your Dream Rooms
          </CardTitle>
          <p className="text-gray-500">Search through a variety of options...</p>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Label className="text-sm font-medium text-gray-700">City</Label>
              <select
                name="city"
                value={filters.city}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 mt-1 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Cities</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Building2 className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Label className="text-sm font-medium text-gray-700">Property Type</Label>
              <select
                name="type"
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 mt-1 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Store">Store</option>
                <option value="Kothi">Kothi</option>
                <option value="PG">PG</option>
                <option value="Single Rooms">Single Rooms</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Price Range</Label>
              <div className="px-2 pt-6 pb-2">
                <Range
                  step={1000}
                  min={0}
                  max={1000000}
                  values={[filters.minPrice || 0, filters.maxPrice || 1000000]}
                  onChange={handlePriceRangeChange}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="h-3 w-full bg-gray-200 rounded-full relative"
                      style={{
                        background: `linear-gradient(to right, #60A5FA ${
                          ((filters.minPrice || 0) / 1000000) * 100
                        }%, #9333EA ${
                          ((filters.maxPrice || 1000000) / 1000000) * 100
                        }%)`,
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => (
                    <div
                      {...props}
                      className="h-6 w-6 bg-white rounded-full shadow-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center cursor-grab"
                    >
                      <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 px-2">
                <span>{formatCurrency(filters.minPrice || 0)}</span>
                <span>{formatCurrency(filters.maxPrice || 1000000)}</span>
              </div>
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            Search Properties
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertySlider;
