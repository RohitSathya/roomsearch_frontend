import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Heart, Share2, MapPin, Bed, Bath, ArrowRight, ArrowLeft } from "lucide-react";
import FirstHeader from "./FirstHeader";
import SecondHeader from "./SecondHeader";
import ThirdHeader from "./ThirdHeader";
import link from "../link";

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
  >
    <ArrowRight className="w-5 h-5 text-gray-600" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
  >
    <ArrowLeft className="w-5 h-5 text-gray-600" />
  </button>
);

const PropertyInfo = () => {
  const { state: property } = useLocation();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [isLoadingOwner, setIsLoadingOwner] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  console.log(property)
  useEffect(() => {
    if (user && property?._id) {
      axios
        .get(`${link}/api/favorites/${user.email}`)
        .then((response) => {
          const isFav = response.data.some((fav) => fav.propertyId === property._id);
          setIsFavorite(isFav);
        })
        .catch((error) => console.error("Error fetching favorite status:", error));
    }
  }, [user, property?._id]);
  
   const fetchOwnerDetails = async (ownerId) => {
    try {
      setIsLoadingOwner(true);
      const response = await axios.get(`${link}/api/owner/${ownerId}`);
      setOwnerDetails(response.data);
    } catch (error) {
      console.error("Error fetching owner details:", error);
      alert("Failed to fetch owner details.");
    } finally {
      setIsLoadingOwner(false);
    }
  };

  const fav = async (property) => {
    if (!user) {
      alert("Please log in to favorite a property.");
      return;
    }

    if (isUpdating) return;

    setIsUpdating(true);
    setIsFavorite((prev) => !prev);

    try {
      await axios.post(`${link}/api/favorites/toggle`, {
        userId: user.uid || user.email,
        propertyId: property._id,
      });
    } catch (error) {
      setIsFavorite((prev) => !prev);
      console.error("Error toggling favorite property:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setActiveImage(next),
  };

 const featuredSliderSettings = {
  dots: false,
  infinite: false, // Change to false to prevent infinite loop
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: false, // Disable autoplay to prevent looping
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

  useEffect(() => {
    if (property?._id) {
      axios
        .get(`${link}/api/comments/${property._id}`)
        .then((response) => setComments(response.data))
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [property?._id]);

useEffect(() => {
  if (property?._id) {
    axios
      .get(`${link}/api/property`)
      .then((response) => {
        // Remove duplicates using Set and filter out current property
        const uniquePropertyIds = new Set();
        const uniqueProperties = response.data.filter(prop => {
          if (prop._id === property._id || uniquePropertyIds.has(prop._id)) {
            return false;
          }
          uniquePropertyIds.add(prop._id);
          return true;
        }).slice(0, 6); // Limit to 6 properties
        
        setFeaturedProperties(uniqueProperties);
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }
}, [property?._id]);

  const handleAddComment = () => {
    if (commentText.trim() && user) {
      const newComment = {
        propertyId: property._id,
        userId: user.uid || user.email,
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
      };

      axios
        .post(`${link}/api/comments`, newComment)
        .then((response) => {
          setComments((prev) => [...prev, response.data]);
          setCommentText("");
        })
        .catch((error) => console.error("Error adding comment:", error));
    } else {
      alert("Please log in to add a comment.");
    }
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`${link}/api/comments/${commentId}`)
      .then(() => {
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">No property information available.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      <ThirdHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.city}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
             <button
    onClick={() => fav(property)}
    disabled={isUpdating}
    className={`p-2 rounded-full transition-colors ${
      isFavorite ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600"
    } hover:bg-gray-200 ${
      isUpdating ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    <Heart className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
  </button>

            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
            <span className="text-2xl font-bold text-orange-500">{property.price}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={property.image}
                alt="Main Property"
                className="w-full h-[500px] object-cover rounded-t-xl"
              />
              <div className="mt-4">
                {property.carouselImages && property.carouselImages.length > 0 ? (
                  <Slider {...mainSliderSettings}>
                    {property.carouselImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                           alt={`Carousel ${index + 1}`}
                          className="w-full h-[300px] object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="mt-4">
                    <img
                      src={property.image}
                      alt="Property"
                      className="w-full h-[300px] object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Property Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-gray-600" />
                  <span>Category</span>
                </div>
                <span className="font-semibold">{property.category}</span>
              </div>
             
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Size</span>
                <span className="font-semibold">{property.size}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Type</span>
                <span className="font-semibold">{property.type}</span>
              </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>FurnishedType</span>
                <span className="font-semibold">{property.furnishedType}</span>
              </div>
               
              
              <button
            onClick={() => fetchOwnerDetails(property.owner)}
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLoadingOwner ? "Fetching..." : "Reserve Property"}
          </button>
            </div>
               {ownerDetails && (
          <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Owner Details</h2>
            <p className="text-lg">
              <strong>Phone:</strong> {ownerDetails.phone || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {ownerDetails.email || "N/A"}
            </p>
          </div>
        )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 bg-gray-50 rounded-lg transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900 mb-2">{comment.text}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{comment.userId}</span>
                    </div>
                  </div>
                  {user && (user.uid === comment.userId || user.email === comment.userId) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleAddComment}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Post
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Featured Properties</h2>
          <div className="relative">
           <Slider {...featuredSliderSettings}>
  {featuredProperties.map((featuredProperty) => (
    <div key={featuredProperty._id} className="px-2">
      <div
        onClick={() =>
          navigate(`/property/${featuredProperty._id}`, { state: featuredProperty })
        }
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform"
      >
        <div className="relative">
          <img
            src={featuredProperty.image}
            alt={featuredProperty.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Heart className="w-6 h-6 text-white hover:text-red-500 transition-colors" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 truncate">
            {featuredProperty.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm truncate">{featuredProperty.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-orange-500 font-bold">
              {featuredProperty.price}
            </span>
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{featuredProperty.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{featuredProperty.bathrooms}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</Slider>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyInfo
