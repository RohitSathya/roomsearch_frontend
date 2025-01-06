import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Facebook, Twitter, User2, Loader2 } from "lucide-react";
import link from "../link";

const AgentTab = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${link}/api/owner`);
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <CardHeader className="mb-6">
        <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Our Agents
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.length > 0 ? (
          agents.map((agent, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {agent.profileImage ? (
                      <img
                        src={agent.profileImage}
                        alt={agent.username}
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-100"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                        <User2 className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {agent.username}
                    </h3>
                    <div className="mt-4 space-y-2">
                      {agent.email && (
                        <div className="flex items-center justify-center space-x-2">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{agent.email}</span>
                        </div>
                      )}
                      {agent.phone && (
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{agent.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-center space-x-3">
                      {agent.facebook && (
                        <a
                          href={agent.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {agent.twitter && (
                        <a
                          href={agent.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-500"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center text-gray-500">
              <User2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No agents found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgentTab;