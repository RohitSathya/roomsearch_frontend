import React, { useEffect, useState } from "react";
import link from "../link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building,
  Activity,
  DollarSign,
} from "lucide-react";
import axios from "axios";

const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="p-4 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-200">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="p-3 rounded-full bg-blue-100">
      <Icon className="text-blue-500 w-6 h-6" />
    </div>
  </div>
);

const ChartPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [propertyCount, setPropertyCount] = useState(0);
  const [agentCount, setAgentCount] = useState(0);
  const [highestPrice, setHighestPrice] = useState(null);
  const [lowestPrice, setLowestPrice] = useState(null);
  const [totalWorth, setTotalWorth] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, propertyResponse, agentResponse] = await Promise.all([
          axios.get(`${link}/api/users`),
          axios.get(`${link}/api/property`),
          axios.get(`${link}/api/owner`),
        ]);

        setUserCount(userResponse.data.length);
        setPropertyCount(propertyResponse.data.length);
        setAgentCount(agentResponse.data.length);

        const activeProperties = propertyResponse.data.filter(
          (property) => property.status?.toLowerCase() === "active"
        );

        const prices = activeProperties.map((property) =>
          parseInt(property.price.replace(/[^\d]/g, ""), 10)
        );

        setHighestPrice(Math.max(...prices));
        setLowestPrice(Math.min(...prices));

        const totalPrice = prices.reduce((sum, price) => sum + price, 0);
        setTotalWorth(totalPrice);

        setMonthlyData(generateMonthlyData(userResponse.data, propertyResponse.data));
        setRevenueData(generateWeeklyRevenue());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const generateMonthlyData = (users, properties) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      name: month,
      users: users.length + Math.floor(Math.random() * 500),
      properties: properties.length + Math.floor(Math.random() * 300),
    }));
  };

  const generateWeeklyRevenue = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      name: day,
      value: Math.floor(Math.random() * 15000) + 5000,
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Users"
            value={userCount.toLocaleString()}
            icon={Users}
          />
          <DashboardCard
            title="Total Properties"
            value={propertyCount.toLocaleString()}
            icon={Building}
          />
          <DashboardCard
            title="Total Agents"
            value={agentCount.toLocaleString()}
            icon={Activity}
          />
          <DashboardCard
            title="Highest Property Value"
            value={`₹${highestPrice?.toLocaleString()}`}
            icon={ArrowUpRight}
          />
          <DashboardCard
            title="Lowest Property Value"
            value={`₹${lowestPrice?.toLocaleString()}`}
            icon={ArrowDownRight}
          />
          <DashboardCard
            title="Total Property Worth"
            value={`₹${totalWorth?.toLocaleString()}`}
            icon={DollarSign}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">User & Property Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#4F46E5" />
                <Bar dataKey="properties" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Weekly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
