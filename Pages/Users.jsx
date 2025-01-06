import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import link from "../link";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${link}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${link}/api/users/${id}`);
      toast.success("User deleted successfully!");
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
        Manage Users
      </h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="table-auto w-full text-left">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Account Type</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-100 transition duration-200"
              >
                <td className="px-4 py-3">{user.username || "N/A"}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.mobile || "N/A"}</td>
                <td className="px-4 py-3 font-semibold">
                  <span
                    className={`px-2 py-1 rounded ${
                      user.googleId
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.googleId ? "Google" : "Normal"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                  >
                    <FaTrashAlt />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <p className="text-lg">No users available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
