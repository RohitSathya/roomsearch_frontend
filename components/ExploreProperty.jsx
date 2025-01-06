import React, { useEffect, useState } from 'react';
import axios from 'axios';
import link from "../link";

const PropertyExplorer = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${link}/api/property`);
        const properties = response.data;

        // Aggregate properties by type
        const typeCounts = properties.reduce((acc, property) => {
          const { type, image } = property;
          if (!acc[type]) {
            acc[type] = { type, count: 0, image };
          }
          acc[type].count += 1;
          return acc;
        }, {});

        // Convert the object into an array
        setPropertyTypes(Object.values(typeCounts));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <p className="text-gray-500 text-sm tracking-wide mb-3">FIND PROPERTY IN YOUR CITY</p>
        <h2 className="text-3xl font-bold tracking-wide mb-4">EXPLORE PROPERTY</h2>
        <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {propertyTypes.map((property, index) => (
          <div 
            key={property.type}
            className={`relative overflow-hidden ${
              index % 2 === 0 
                ? 'lg:col-span-6 h-[400px]' 
                : 'lg:col-span-3 h-[300px]'
            }`}
          >
            <div className="relative h-full group">
              <img
                src={property.image || "https://via.placeholder.com/400x300?text=No+Image+Available"}
                alt={property.type}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold mb-2">{property.type}</h3>
                <p className="flex items-center text-base">
                  <span className="text-orange-500 mr-2">{property.count}</span>
                  {property.count === 1 ? 'Property' : 'Properties'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyExplorer;
