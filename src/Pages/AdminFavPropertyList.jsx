import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Bed, Bath } from "lucide-react";
import link from '../link'
const AdminFavPropertyList = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);

  // Fetch favorite properties with user details
  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      try {
        const response = await axios.get(`${link}/api/admin/favorite-properties`);
        setFavoriteProperties(response.data);
      } catch (error) {
        console.error("Error fetching favorite properties:", error);
      }
    };

    fetchFavoriteProperties();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        User Favorite Properties
      </h1>
      {favoriteProperties.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No favorite properties found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map(({ user, property }) => (
            <div
              key={property._id}
              className="rounded-lg shadow-md bg-white p-4 hover:shadow-lg transition"
            >
              {/* Property Image */}
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover rounded-md"
              />
              {/* Property Details */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {property.title}
                </h3>
                <div className="text-gray-600 text-sm flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                  <span>{property.address}</span>
                </div>
                <div className="text-lg font-bold text-orange-500 mt-2">
                  {property.price}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.category} Category
                  </span>
                   <span className="text-sm text-gray-500 flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    {property.address} Address
                  </span>
                 
                </div>
              </div>
              {/* User Details */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700">
                  Favorited By:
                </h4>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Name:</span> {user.username}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Email:</span> {user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">Phone:</span> {user.mobile || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFavPropertyList;
