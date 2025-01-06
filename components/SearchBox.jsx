import React, { useState, useEffect, useRef } from "react";
import { X, BedDouble, Bath, Home, MapPin, DollarSign, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import link from "../link";
const SearchBox = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("auto");
  
  const [filters, setFilters] = useState({
    type: "",
    title: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    minPrice: "",
    maxPrice: "",
    size: "",
    propertyId: "",
  });

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

  useEffect(() => {
    if (isExpanded && containerRef.current) {
      const contentHeight = Math.max(
        containerRef.current.scrollHeight,
        window.innerHeight * 0.9
      );
      setContainerHeight(`${contentHeight}px`);
    } else {
      setContainerHeight("auto");
    }
  }, [isExpanded, filteredProperties]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getPriceNumber = (priceString) => {
    return parseInt(priceString.replace(/[^0-9.-]+/g, ""), 10);
  };

  const handleSearch = () => {
    if (Object.values(filters).every((value) => !value)) {
      setFilteredProperties(properties);
      setIsExpanded(true);
      return;
    }

    let filtered = properties.filter(property => {
      const matchesType = !filters.type || 
        property.type.toLowerCase() === filters.type.toLowerCase();
      const matchesTitle = !filters.title || 
        property.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchesAddress = !filters.address || 
        property.address.toLowerCase().includes(filters.address.toLowerCase());
      const matchesBedrooms = !filters.bedrooms || 
        property.bedrooms === parseInt(filters.bedrooms, 10);
      const matchesBathrooms = !filters.bathrooms || 
        property.bathrooms === parseInt(filters.bathrooms, 10);
      const propertyPrice = getPriceNumber(property.price);
      const matchesMinPrice = !filters.minPrice || 
        propertyPrice >= parseInt(filters.minPrice, 10);
      const matchesMaxPrice = !filters.maxPrice || 
        propertyPrice <= parseInt(filters.maxPrice, 10);
      const matchesSize = !filters.size || 
        parseInt(property.size, 10) >= parseInt(filters.size, 10);
      const matchesId = !filters.propertyId || 
        property._id === filters.propertyId;

      return matchesType && matchesTitle && matchesAddress && 
             matchesBedrooms && matchesBathrooms && matchesMinPrice && 
             matchesMaxPrice && matchesSize && matchesId;
    });

    setFilteredProperties(filtered);
    setIsExpanded(true);
  };

  return (
    <div
    ref={containerRef}
    className="relative transition-all duration-500 ease-in-out bg-gradient-to-b from-gray-900 to-gray-800"
    style={{
      height: containerHeight,
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://cdn.mos.cms.futurecdn.net/8Zw7hWD5ZaquyftsRbEmof-1200-80.jpg')",
      backgroundBlendMode: "overlay",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-2">
            <h2 className="text-sm font-light tracking-wider text-gray-300 animate-fade-in">
              DISCOVER YOUR
            </h2>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text animate-slide-up">
              DREAM HOUSE
            </h1>
          </div>

          <div className="lg:col-span-2">
            <div className="p-4 backdrop-blur-md bg-white/5 rounded-2xl shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleInputChange}
                  className="bg-gray-800/80 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm hover:bg-gray-700/80"
                >
                  <option value="">All Types</option>
                  <option value="Store">Store</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                </select>

                <input
                  type="text"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleInputChange}
                  placeholder="Min Price"
                  className="bg-gray-800/80 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm hover:bg-gray-700/80"
                />

                <input
                  type="text"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Max Price"
                  className="bg-gray-800/80 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm hover:bg-gray-700/80"
                />

                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium shadow-lg"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="animate-fade-in">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property._id}
                    className="group bg-gray-800/70 backdrop-blur-md rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    <div className="relative">
                      <img
                        src={property.image || "/api/placeholder/400/300"}
                        alt={property.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {property.type}
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-white mb-2">{property.title}</h2>
                      <div className="flex items-center space-x-2 text-gray-300 mb-4">
                        <MapPin size={16} />
                        <p className="text-sm truncate">{property.address}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-6 text-gray-300">
                          <span className="flex items-center space-x-2">
                            <BedDouble size={16} />
                            <span>{property.bedrooms}</span>
                          </span>
                          <span className="flex items-center space-x-2">
                            <Bath size={16} />
                            <span>{property.bathrooms}</span>
                          </span>
                        </div>
                        <p className="text-orange-500 font-bold text-lg">{property.price}</p>
                      </div>
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm font-medium shadow-lg transform hover:scale-105"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800/50 backdrop-blur-md rounded-2xl">
                <Home size={64} className="mx-auto mb-6 text-gray-400" />
                <p className="text-gray-300 text-lg">No properties found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
          <DialogContent className="max-w-3xl bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedProperty?.title}</span>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="hover:bg-gray-800 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchBox;