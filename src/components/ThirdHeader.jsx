import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import link from "../link";
import { signInWithGoogle } from "./firebase";

const ThirdHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [showModal, setShowModal] = useState(false);
    const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (user && !user.mobile) {
      setShowMobilePrompt(true);
    }
  }, [user]);


  const toggleModal = () => setShowModal(!showModal);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        toast.error("Google login failed.");
        return;
      }
  
      const response = await fetch(`${link}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.user),
      });
  
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user); // Save user details
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(`Welcome, ${data.user.username}!`);
        setShowModal(false);
  
        // Prompt for mobile number if missing
        if (!data.user.mobile) {
          setShowMobilePrompt(true);
        }
      } else {
        toast.error(data.message || "Failed to save user data.");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  
  const handleMobileSubmit = async () => {
    // Validate mobile number
    const isValidMobile = /^[6-9]\d{9}$/.test(mobileNumber); // Validates a 10-digit number starting with 6-9
    if (!mobileNumber) {
      toast.error("Please enter your mobile number.");
      return;
    }
    if (!isValidMobile) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
  
    try {
      const response = await fetch(`${link}/api/auth/update-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, mobile: mobileNumber }),
      });
  
      const data = await response.json();
      if (response.ok && data.success) {
        // Update user data
        const updatedUser = { ...user, mobile: mobileNumber };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Mobile number updated successfully!");
        setShowMobilePrompt(false);
      } else {
        toast.error(data.message || "Failed to update mobile number.");
      }
    } catch (error) {
      console.error("Error during mobile number submission:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  
  
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const response = await fetch(`${link}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.username}!`);
      setShowModal(false);
      if (!data.user.mobile) {
        setShowMobilePrompt(true);
      }
    } else {
      toast.error(data.message || "Login failed.");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const phone = event.target.phone.value;

    const response = await fetch(`${link}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, phone }),
    });

    const data = await response.json();
    if (data.success) {
      const newUser = { username, email, mobile: phone };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success(`Welcome, ${username}!`);
      setShowModal(false);
    } else {
      toast.error(data.message || "Registration failed.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out.");
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      <ToastContainer />
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left Section: Logo */}
        <img
          src="https://res.cloudinary.com/dpgf1rkjl/image/upload/v1735968408/h69jufrpojg8qvedd0uy.png"
          alt="Logo"
          className="h-12 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Center Section: Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            onClick={() => navigate("/")}
            className="text-black hover:text-orange-500 font-medium cursor-pointer"
          >
            HOME
          </a>
          <a
            href="#"
            className="text-black hover:text-orange-500 font-medium cursor-pointer"
          >
            PROPERTIES
          </a>
          <div className="relative group">
            <a
              href="#"
              className="text-black hover:text-orange-500 font-medium flex items-center"
            >
              MY ACCOUNT
              <span className="ml-1 text-orange-500">▼</span>
            </a>
            {/* Dropdown */}
            <div
              className="absolute top-full left-0 bg-white shadow-lg rounded-lg mt-2 p-4 w-48 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
            >
            
             
             
           
              <a
                href="#"
                className="block text-gray-700 hover:text-orange-500 font-medium py-2"
                onClick={() => navigate('/favouriteproperty')}
              >
                My Favourites
              </a>
             
            
            </div>
          </div>
        </nav>

        {/* Right Section: Login/Register */}
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-orange-500 font-semibold">
                Welcome, {user.username}!
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-black transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={toggleModal}
              className="flex items-center text-gray-700 hover:text-black transition"
            >
              <FaUser className="text-orange-500 mr-2" />
              <span>Login or Register</span>
            </button>
          )}

          {/* Hamburger Menu Icon for Small Devices */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black ml-4"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="flex flex-col bg-white shadow-md px-6 py-4 md:hidden">
          <a
            onClick={() => navigate("/")}
            className="text-black hover:text-orange-500 font-medium py-2"
          >
            HOME
          </a>
          <a
            href="#"
            className="text-black hover:text-orange-500 font-medium py-2"
          >
            PROPERTIES
          </a>
          <a
            href="#"
            className="text-black hover:text-orange-500 font-medium py-2"
          >
            MY ACCOUNT
          </a>
        </nav>
      )}

      {/* Modal for Login/Register */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-black transition"
            >
              <MdClose size={24} />
            </button>

            <div className="flex justify-center space-x-4 border-b p-4">
              <button
                onClick={() => setIsLoginView(true)}
                className={`text-lg font-semibold ${
                  isLoginView
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500"
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => setIsLoginView(false)}
                className={`text-lg font-semibold ${
                  !isLoginView
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500"
                }`}
              >
                Register
              </button>
            </div>

            <div className="p-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4"
              >
                Continue with Google
              </button>
              {isLoginView ? (
                <form className="space-y-4" onSubmit={handleLogin}>
                  <input
                    name="email"
                    placeholder="Email"
                    className="w-full border px-4 py-2 rounded-lg text-black focus:ring focus:ring-orange-500 focus:outline-none"
                  />
                  <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="w-full border px-4 py-2 rounded-lg text-black focus:ring focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Login
                  </button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleRegister}>
                  <input
                    name="username"
                    placeholder="Username"
                    className="w-full border px-4 py-2 rounded-lg text-black focus:ring focus:ring-orange-500 focus:outline-none"
                  />
                  <input
                    name="phone"
                    placeholder="Mobile number"
                    maxLength="10"
                    className="w-full border px-4 py-2 rounded-lg text-black focus:ring focus:ring-orange-500 focus:outline-none"
                  />
                  <input
                    name="email"
                    placeholder="Email"
                    className="w-full border px-4 py-2 rounded-lg text-black focus:ring focus:ring-orange-500 focus:outline-none"
                  />
                  <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="w-full border px-4 py-2 rounded-lg text-black focus:ring focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Register
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {showMobilePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Mobile Number Required</h2>
            <p className="text-gray-600 mb-4">
              Please enter your mobile number to proceed.
            </p>
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              maxLength='10'
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring focus:ring-orange-500 focus:outline-none text-black"
            />
            <button
              onClick={handleMobileSubmit}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default ThirdHeader;
