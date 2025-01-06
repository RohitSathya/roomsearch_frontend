import React, { useState } from 'react';
import link from "../link";

const ImageUploader = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Replace with your Cloudinary details
  const cloudName = 'dpgf1rkjl'; // Your Cloudinary cloud name
  const unsignedUploadPreset = 'unsigned_preset'; // Your unsigned preset name

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      uploadToCloudinary(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    setIsUploading(true);
    setCopySuccess(false); // Reset copy success state

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', unsignedUploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadedImageUrl(data.secure_url);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadedImageUrl) {
      navigator.clipboard.writeText(uploadedImageUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
        <h1 className="text-lg font-bold mb-4 text-center">Image Uploader</h1>

        <div className="mb-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload an Image
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {imagePreview && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md"
            />
          </div>
        )}

        {isUploading && (
          <p className="text-sm font-medium text-indigo-600">Uploading...</p>
        )}

        {uploadedImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Image URL:</p>
            <a
              href={uploadedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline break-all"
            >
              {uploadedImageUrl}
            </a>
            <button
              onClick={handleCopyLink}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
            >
              {copySuccess ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;