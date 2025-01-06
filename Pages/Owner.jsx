import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Select from "react-select";
import countryList from "react-select-country-list";
import link from "../link";
import { Pencil } from "lucide-react";



const Owner = () => {
  const [properties, setProperties] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [ownerUsername, setOwnerUsername] = useState("");
    const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    price: "",
    address: "",
    state: "Punjab",
    city: "",
    type: "",
    agent: "",
    time: "",
    size: "",
    status: "active",
    bedrooms: 0,
    bathrooms: 0,
    badges: "Rent",
    carouselImages: [],
    location: {
      lat: 0,
      lng: 0,
    },
    preferredTenant: "",
    furnishedType: "",
    category: "",
  });
  const [editId, setEditId] = useState(null);
  const [previewImages, setPreviewImages] = useState({
    main: null,
    carousel: [],
  });
  const categories = ["1BHK", "2BHK", "3BHK", "4BHK", "4+ BHK", "Studio Apartment", "Annexy"];
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
   const states = [
  "Punjab",         // Mohali, Kharar, Zirakpur, Sahibzada Ajit Singh Nagar, Phagwara
  "Chandigarh"      // Chandigarh, Panjab University
];
  const furnishedTypes = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
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
  const propertyTypes = ["Apartment", "Villa", "Store", "PG", "Single Rooms", "Sharing PG", "Kothi"];

  const bg = ["Rent", "Sale"];


  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const countryOptions = countryList().getData();
  const [profileData, setProfileData] = useState({
    profileImage: "",
    facebook: "",
    twitter: "",
    email: "",
    phone: "",
  });
  
  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, country: selectedOption }));
    fetchStates(selectedOption.label);
  };

  const handleStateChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, state: selectedOption }));
    fetchCities(selectedOption.value);
  };

  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, city: selectedOption }));
  };
  const fetchStates = async () => {
    try {
      const response = await axios.post("https://countriesnow.space/api/v0.1/countries/states", {
        country: formData.country, // Specify the country name here
      });
  
      if (response.data && response.data.data) {
        console.log("States:", response.data.data.states);
        return response.data.data.states; // Array of states
      } else {
        console.error("Error: Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateName) => {
    try {
      const countryName = formData.country?.label;
      const response = await axios.get("https://countriesnow.space/api/v0.1/countries/state/cities", {
        params: { country: countryName, state: stateName },
      });
      const cities = response.data.data.map((city) => ({ label: city, value: city }));
      setCityOptions(cities);
    } catch (error) {
      toast.error("Error fetching cities");
    }
  };
  const fetchProfile = async () => {
    try {
      const ownerId = localStorage.getItem("ownerId");
      const response = await axios.get(`${link}/api/owner/${ownerId}/profile`);
      setProfileData(response.data);
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const ownerId = localStorage.getItem("ownerId");
      await axios.put(`${link}/api/owner/${ownerId}/profile`, profileData);
      toast.success("Profile updated successfully!");
      await fetchProfile();
    } catch (error) {
      toast.error("Error updating profile");
    }
  };
   const handleUsernameEditToggle = () => {
    setIsEditingUsername(!isEditingUsername);
    setNewUsername(ownerUsername);
  };

  const handleUsernameChange = async () => {
    try {
      if (newUsername.trim() === "") {
        toast.error("Username cannot be empty.");
        return;
      }

      const ownerId = localStorage.getItem("ownerId");
      const response = await axios.put(`${link}/api/owner/${ownerId}/username`, { username: newUsername });

      if (response.data.message === "Username already exists") {
        toast.error("Username already exists. Please choose a different one.");
      } else {
        toast.success("Username updated successfully.");
        setOwnerUsername(newUsername);
        localStorage.setItem("ownerUsername", newUsername);
        setIsEditingUsername(false);
      }
    } catch (error) {
      toast.error("Error updating username.");
    }
  };

  

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");
    const storedUsername = localStorage.getItem("ownerUsername");
    if (storedUsername) {
      setOwnerUsername(storedUsername);
    }
    if (isAuthenticated && ownerId) {
      fetchProperties();
      fetchProfile(); 
    }
  }, [isAuthenticated]);
  

  const fetchProperties = async () => {
    try {
      console.log('dfjdsjsdjsdj')
      const ownerId = localStorage.getItem("ownerId");
      const response = await axios.get(`${link}/api/owner/${ownerId}/properties`);
      console.log(response.data)
      setProperties(response.data);
    } catch (error) {
      toast.error("Error fetching properties");
    }
  };

const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setPreviewImages((prev) => ({ ...prev, main: value }));
    }
    setFormData((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };
  const handleCarouselImagesChange = (e) => {
    const urls = e.target.value.split(",").map((url) => url.trim());
    setFormData((prev) => ({ ...prev, carouselImages: urls }));
    setPreviewImages((prev) => ({ ...prev, carousel: urls }));
  };

  const handleBadgesChange = (e) => {
    const badges = e.target.value.split(",").map((badge) => badge.trim());
    setFormData((prev) => ({ ...prev, badges }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ownerId = localStorage.getItem("ownerId");
      if (editId) {
        console.log(formData,123)
        await axios.put(`${link}/api/owner/${ownerId}/property/${editId}`, formData);
       
        toast.success("Property updated successfully!");
      } else {
        console.log(formData,123)
        await axios.post(`${link}/api/owner/${ownerId}/property`, formData);
        toast.success("Property added successfully!");
      }
      resetForm();
      fetchProperties();
    } catch (error) {
      toast.error(editId ? "Error updating property" : "Error adding property");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const ownerId = localStorage.getItem("ownerId");
        await axios.delete(`${link}/api/owner/${ownerId}/property/${id}`);
        toast.success("Property deleted successfully!");
        fetchProperties();
      } catch (error) {
        toast.error("Error deleting property");
      }
    }
  };

  const handleEdit = (property) => {
    setEditId(property._id);
    setFormData(property);
    setPreviewImages({
      main: property.image,
      carousel: property.carouselImages || [],
    });
    setCurrentCarouselIndex(0);
  };

 
  const resetForm = () => {
    setEditId(null);
    setFormData({
      image: "",
      title: "",
      price: "",
      address: "",
      state: "",
      city: "",
      status: "active",
      type: "",
      agent: "",
      time: "",
      size: "",
      bedrooms: 0,
      bathrooms: 0,
      badges: [],
      carouselImages: [],
      location: {
        lat: 0,
        lng: 0,
      },
      preferredTenant: "",
      furnishedType: "",
      category: "",
    });
    setPreviewImages({
      main: null,
      carousel: [],
    });
    setCurrentCarouselIndex(0);
  };

  const handleLoginOrSignup = async (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;
    try {
      if (isLoginMode) {
        // Login logic
        const response = await axios.post(`${link}/api/owner/login`, {
          username: username.value,
          password: password.value,
        });
  
        // Store ownerId in localStorage
        localStorage.setItem("ownerId", response.data.ownerId);
        localStorage.setItem("ownerUsername", response.data.username);
        setIsAuthenticated(true);
  
        // Fetch properties immediately after login
        await fetchProperties();
  
        // Display success toast
        toast.success("Login successful");
      } else {
        // Signup logic
        const response = await axios.post(`${link}/api/owner/signup`, {
          username: username.value,
          password: password.value,
        });
  
        if (response.data.message === "Username already exists") {
          toast.error("Username already exists. Please try a different one.");
        } else {
          toast.success("Signup successful! Please login.");
          setIsLoginMode(true);
        }
      }
    } catch (error) {
      toast.error(isLoginMode ? "Invalid credentials" : "Signup failed");
    }
  };
  
  

  const handleLogout = () => {
    localStorage.removeItem("ownerId");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          {isLoginMode ? "Owner Login" : "Owner Signup"}
        </h2>
        <form onSubmit={handleLoginOrSignup}>
          <div className="mb-4">
            <Label>Username</Label>
            <Input name="username" placeholder="Enter username" required />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type={showPassword ? "text" : "password"} // Toggle input type
              name="password"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="show-password"
              className="mr-2"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)} // Toggle state on change
            />
            <label htmlFor="show-password" className="text-gray-600">
              Show Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {isLoginMode ? "Login" : "Signup"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-blue-500 underline"
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode ? "Signup" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex">
        {/* Sidebar for Profile Settings */}
        <div className="bg-gray-800 text-white w-1/4 h-screen p-6">
    <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
    <form onSubmit={handleProfileSubmit} className="space-y-4">
      {/* Username Section */}
      <div className="space-y-2">
        <Label className="text-white">Username</Label>
        <div className="flex items-center space-x-2">
          {isEditingUsername ? (
            <>
              <Input
                type="text"
                name="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                className="bg-gray-700 text-white flex-1"
              />
              <button
                onClick={handleUsernameChange}
                type="button"
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingUsername(false)}
                type="button"
                className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <Input
                type="text"
                name="username"
                value={ownerUsername}
                readOnly
                className="bg-gray-700 text-white flex-1 cursor-not-allowed"
              />
              <button
                onClick={handleUsernameEditToggle}
                type="button"
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Picture */}
      <div className="space-y-2">
        <Label className="text-white">Profile Picture URL</Label>
        <Input
          type="url"
          name="profileImage"
          value={profileData.profileImage}
          onChange={handleProfileChange}
          placeholder="Profile Image URL"
          className="bg-gray-700 text-white"
        />
      </div>

      {/* Facebook URL */}
      <div className="space-y-2">
        <Label className="text-white">Facebook</Label>
        <Input
          type="url"
          name="facebook"
          value={profileData.facebook}
          onChange={handleProfileChange}
          placeholder="Facebook URL"
          className="bg-gray-700 text-white"
        />
      </div>

      {/* Twitter URL */}
      <div className="space-y-2">
        <Label className="text-white">Twitter</Label>
        <Input
          type="url"
          name="twitter"
          value={profileData.twitter}
          onChange={handleProfileChange}
          placeholder="Twitter URL"
          className="bg-gray-700 text-white"
        />
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <Label className="text-white">Email</Label>
        <Input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleProfileChange}
          placeholder="Email Address"
          className="bg-gray-700 text-white"
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label className="text-white">Phone</Label>
        <Input
          type="tel"
          name="phone"
          value={profileData.phone}
          maxLength="10"
          pattern="[0-9]{10}"
          onChange={handleProfileChange}
          placeholder="10-digit Phone Number"
          className="bg-gray-700 text-white"
        />
      </div>

      {/* Save Profile Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Save Profile
      </button>
    </form>
  </div>
  
        {/* Main Content Area */}
        <div className="container mx-auto p-4 flex-1">
          <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
    Welcome, <span className="text-blue-500">{ownerUsername}</span>
  </h1>
            <h1 className="text-3xl font-bold">My Properties</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
  
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           <div className="space-y-2">
  <Label>State</Label>
  <select
    name="state"
    value={formData.state}
    onChange={handleInputChange}
    className="w-full pl-3 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
  >
    <option value="" disabled>
      Select a State
    </option>
    {states.map((state, index) => (
      <option key={index} value={state}>
        {state}
      </option>
    ))}
  </select>
</div>
            {/* City */}
           <div className="space-y-2">
                  <Label>City</Label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Property Title"
                      required
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                      required
                    />
                  </div>
                    <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                  
                  
  
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      required
                    />
                  </div>
  
                    <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                  <div className="space-y-2">
  <Label>Status</Label>
  <select
    name="status"
    value={formData.status}
    onChange={handleInputChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>
  
                  <div className="space-y-2">
                    <Label>Agent Name</Label>
                    <Input
                      type="text"
                      name="agent"
                      value={formData.agent}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Input
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="Size in SqFt"
                      required
                    />
                  </div>
                   <div className="space-y-2">
                  <Label>Preferred Tenant</Label>
                  <select
                    name="preferredTenant"
                    value={formData.preferredTenant}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant} value={tenant}>
                        {tenant}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Furnished Type</Label>
                  <select
                    name="furnishedType"
                    value={formData.furnishedType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Furnished Type</option>
                    {furnishedTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
  
                 
  
                <div className="space-y-2">
  <Label>Badges</Label>
  <select
    name="badges"
    value={formData.badges}
   onChange={handleInputChange}
    className="w-full pl-3 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
  >
    {bg.map((badge, index) => (
      <option key={index} value={badge}>
        {badge}
      </option>
    ))}
  </select>
</div>
                  <div className="space-y-2">
                    <Label>Main Image URL</Label>
                    <Input
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Main Image URL"
                      required
                    />
                  </div>
  
                  <div className="space-y-2 col-span-full">
                    <Label>Carousel Images (comma-separated URLs)</Label>
                    <Input
                      name="carouselImages"
                      value={formData.carouselImages.join(", ")}
                      onChange={handleCarouselImagesChange}
                      placeholder="Image URL 1, Image URL 2, ..."
                    />
                  </div>
                </div>
  
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    {editId ? "Update Property" : "Add Property"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
  
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{property.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{property.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{property.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(property)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default Owner;
