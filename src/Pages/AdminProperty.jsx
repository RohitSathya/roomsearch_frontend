import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import link from "../link";

const AdminProperty = () => {
  const [properties, setProperties] = useState([]);
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
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

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

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${link}/api/property`);
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
      if (editId) {
        await axios.put(`${link}/api/admin/property/${editId}`, formData);
        toast.success("Property updated successfully!");
      } else {
        await axios.post(`${link}/api/admin/property`, formData);
        toast.success("Property added successfully!");
      }
      resetForm();
      fetchProperties();
    } catch (error) {
    console.error("Error response:", error.response?.data);
    toast.error(error.response?.data?.message || "Error adding/updating property");
  }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`${link}/api/admin/property/${id}`);
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

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Property Management</h1>

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
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Property Address"
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
                  <Label>Agent Name</Label>
                  <Input
                    name="agent"
                    value={formData.agent}
                    onChange={handleInputChange}
                    placeholder="Agent Name"
                    required
                  />
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

                <div className="space-y-2 col-span-full">
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
                    Category
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
                    <td className="px-6 py-4 whitespace-nowrap">{property.category}</td>
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
    </>
  );
};

export default AdminProperty;
