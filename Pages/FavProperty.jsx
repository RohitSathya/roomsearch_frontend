import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, MapPin, Bed, Bath } from "lucide-react";
import FirstHeader from "../components/FirstHeader";
import SecondHeader from "../components/SecondHeader";
import ThirdHeader from "../components/ThirdHeader";
import MobileAppPromo from "../components/MobileAppPromo";
import ClientsSlider from "../components/ClientsSlider";
import NewsletterSection from "../components/NewsletterSection";
import Footer1 from "../components/Footer1";
import Footer2 from "../components/Footer2";
import link from "../link";

const PropertyCard = ({ property, isFavorite, onToggleFavorite, onClick }) => (
  <div className="rounded-lg shadow-lg overflow-hidden bg-white transition-transform transform hover:scale-105 cursor-pointer">
    <div onClick={onClick}>
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-56 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            onToggleFavorite(property._id);
          }}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors ${
            isFavorite
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Heart className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {property.title}
        </h3>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-5 h-5 mr-2 text-orange-500" />
          <span className="truncate">{property.address}</span>
        </div>
        <div className="text-lg font-bold text-orange-500">{property.price}</div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Baths</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FavProperty = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const toggleFavorite = async (propertyId) => {
    try {
      await axios.post(`${link}/api/favorites/toggle`, {
        userId: user.email,
        propertyId,
      });

      setFavoriteProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        const favResponse = await axios.get(
          `${link}/api/favorites/${user.email}`
        );
        const favIds = favResponse.data.map((fav) => fav.propertyId);

        const propertyDetails = await Promise.all(
          favIds.map((id) =>
            axios.get(`${link}/api/property/${id}`).then((res) => res.data)
          )
        );

        setFavoriteProperties(propertyDetails);
      } catch (error) {
        console.error("Error fetching favorite properties:", error);
      }
    };

    fetchProperties();
  }, [user]);

  return (
    <>
    
      <ThirdHeader />
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Your Favorite Properties
          </h1>
          {favoriteProperties.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">
              You have no favorite properties yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onClick={() =>
                    navigate(`/property/${property._id}`, { state: property })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <MobileAppPromo />
      </div>
      <div className="mt-10">
        <ClientsSlider />
      </div>
      <div className="mt-10">
        <NewsletterSection />
      </div>
      <Footer1 />
      <Footer2 />
    </>
  );
};

export default FavProperty;
