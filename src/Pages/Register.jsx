import React, { useState } from "react";
import { toast } from "react-toastify";
import FirstHeader from "../components/FirstHeader";
import SecondHeader from "../components/SecondHeader";
import ThirdHeader from "../components/ThirdHeader";
import NewsletterSection from "../components/NewsletterSection";
import Footer1 from "../components/Footer1";
import Footer2 from "../components/Footer2";
import { signInWithGoogle } from "./firebase";
import { useNavigate } from "react-router-dom";
import link from "../link";
const Register = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const nav = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        const response = await fetch(`${link}/api/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.user),
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success(`Welcome, ${data.user.username}!`);
          if (!data.user.mobile) {
            setShowMobilePrompt(true);
          } else {
            nav("/");
          }
          setShowModal(false);
        } else {
          toast.error("Failed to save user data.");
        }
      } else {
        toast.error("Google login failed.");
      }
    } catch (error) {
      toast.error("An error occurred during Google login.");
      console.error(error);
    }
  };

  const handleMobileSubmit = async () => {
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number starting with 6-9.");
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
        const updatedUser = { ...user, mobile: mobileNumber };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Mobile number updated successfully!");
        setShowMobilePrompt(false);
        nav("/");
      } else {
        toast.error(data.message || "Failed to update mobile number.");
      }
    } catch (error) {
      console.error("Error during mobile number submission:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const phone = event.target.phone.value;

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      toast.error("Passwords do not match.");
      return;
    }
    setPasswordMatch(true);

    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    try {
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
        nav("/");
        setShowModal(false);
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.error(error);
    }
  };

  return (
    <>
      <FirstHeader />
      <SecondHeader />
      <ThirdHeader />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1734532873375-574fd74045c5?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "darken",
        }}
      >
        <div className="bg-gray-900 bg-opacity-50 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Register
          </h2>
          <form onSubmit={handleRegister}>
            <div className="relative mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative mb-4">
              <input
                type="tel"
                name="phone"
                maxLength="10"
                placeholder="Mobile Number"
                className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full px-4 py-2 rounded-md bg-transparent border ${
                  passwordMatch ? "border-gray-600" : "border-red-600"
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                required
              />
            </div>

            <div className="relative mb-6">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Retype Password"
                className={`w-full px-4 py-2 rounded-md bg-transparent border ${
                  passwordMatch ? "border-gray-600" : "border-red-600"
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                required
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-orange-500 focus:ring-orange-500 focus:ring-2 rounded"
                required
              />
              <label className="text-gray-400">
                I agree with your {" "}
                <a href="#" className="text-orange-500 hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition-colors mb-4"
            >
              Register
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2 bg-white text-gray-700 rounded-md font-semibold flex items-center justify-center shadow-md hover:shadow-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src="https://e7.pngegg.com/pngimages/715/371/png-clipart-youtube-google-logo-google-s-google-account-youtube-text-trademark.png"
                alt="Google Logo"
                className="w-6 h-6 mr-2"
              />
              Continue with Google
            </button>
          </form>
        </div>
      </div>

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
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring focus:ring-orange-500 focus:outline-none"
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

      <NewsletterSection />
      <Footer1 />
      <Footer2 />
    </>
  );
};

export default Register;
