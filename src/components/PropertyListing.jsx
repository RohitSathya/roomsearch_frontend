import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Home, Users, BedDouble } from "lucide-react";
import axios from "axios";
import SecondHeader from "./SecondHeader";
import ThirdHeader from "./ThirdHeader";
import NewsletterSection from "./NewsletterSection";
import Footer1 from "./Footer1";
import Footer2 from "./Footer2";
import link from "../link";

const categories = ["All", "1BHK", "2BHK", "3BHK", "4BHK", "4+ BHK", "Studio Apartment", "Annexy"];
const tenants = [
  "All",
  "Boys",
  "Girls",
  "Boys & Girls",
  "Family",
  "Family & Boys",
  "Family & Girls",
  "Company",
];
const furnishedTypes = ["All", "Fully Furnished", "Semi Furnished", "Unfurnished"];
const ITEMS_PER_PAGE = 9;

const PropertyListing = () => {
  const location = useLocation();
  const filters2 = location.state?.filters || {};
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    category: "All",
    preferredTenant: "All",
    furnishedType: "All",
    minPrice: 0,
    maxPrice: 500000,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${link}/api/property`);
        setProperties(res.data);
        setFilteredProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
      setIsLoading(false);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter((property) => {
      const price = parsePrice(property.price);
      return (
        property.status?.toLowerCase() === "active" &&
        (!filters2.type || property.type.toLowerCase() === filters2.type.toLowerCase()) &&
        (!filters2.city || property.city?.toLowerCase() === filters2.city.toLowerCase()) &&
        (!filters2.minPrice || price >= filters2.minPrice) &&
        (!filters2.maxPrice || price <= filters2.maxPrice) &&
        (filters.category === "All" || property.category === filters.category) &&
        (filters.preferredTenant === "All" || property.preferredTenant === filters.preferredTenant) &&
        (filters.furnishedType === "All" || property.furnishedType === filters.furnishedType) &&
        price >= filters.minPrice &&
        price <= filters.maxPrice
      );
    });
    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [filters, properties]);

  const parsePrice = (price) => {
    const cleanPrice = price.replace(/[^\d]/g, "");
    return cleanPrice ? parseInt(cleanPrice) : 0;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e, bound) => {
    const value = e.target.value ? parseInt(e.target.value) : 0;
    setFilters((prev) => ({ ...prev, [bound]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  return (
    <>
      <ThirdHeader />

      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-center text-5xl font-bold text-white mb-6">
            Find Your Dream Room
          </h1>
          <p className="text-center text-white text-xl max-w-2xl mx-auto">
            Discover the perfect living space tailored to your lifestyle and preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-6 gap-8">
        <div className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
              <span className="text-sm text-gray-500">
                {filteredProperties.length} properties
              </span>
            </div>

            <div className="space-y-6">
              <div className="filter-section">
                <label className="block text-sm font-semibold mb-3 text-gray-700">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="ml-3 text-sm text-gray-600 hover:text-gray-800">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                
                <div className="space-y-3">
                 
                </div>
              </div>

              <div className="filter-section">
                <label className="block text-sm font-semibold mb-3 text-gray-700">Preferred Tenant</label>
                <div className="space-y-2">
                  {tenants.map((tenant) => (
                    <div key={tenant} className="flex items-center">
                      <input
                        type="radio"
                        name="preferredTenant"
                        value={tenant}
                        checked={filters.preferredTenant === tenant}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="ml-3 text-sm text-gray-600 hover:text-gray-800">
                        {tenant}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <label className="block text-sm font-semibold mb-3 text-gray-700">Furnished Type</label>
                <div className="space-y-2">
                  {furnishedTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="furnishedType"
                        value={type}
                        checked={filters.furnishedType === type}
                        onChange={handleFilterChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="ml-3 text-sm text-gray-600 hover:text-gray-800">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : paginatedProperties.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProperties.map((property) => (
                  <div 
                    key={property._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-xl h-full"
                    onClick={() => navigate(`/property/${property._id}`, { state: property })}
                  >
                    <div className="relative h-48">
                      <img
                        src={property.image || "/api/placeholder/400/320"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/50"/>
                      <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {property.type}
                      </span>
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {property.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                        {property.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 truncate">{property.city}</span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{property.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{property.preferredTenant}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                          {property.furnishedType}
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                          Available Now
                        </span>
                      </div>

                      <div className="border-t pt-3 flex items-center justify-between">
                        <p className="text-xl font-bold text-blue-600">
                          {property.price}
                        </p>
                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400"
                          : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                      }`}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white font-medium"
                            : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400"
                          : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-xl">No properties match your filters.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      <NewsletterSection />
      <Footer1 />
      <Footer2 />
    </>
  );
};

export default PropertyListing;
