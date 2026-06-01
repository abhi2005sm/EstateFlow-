"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import {
  superAdminApi,
  OwnerRegistrationData,
  Owner,
} from "../api/api";

export default function ApartmentsTable() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    fetchOwners();
  }, []);

  // FETCH OWNERS
  const fetchOwners = async () => {
    try {
      setIsLoading(true);

      const data = await superAdminApi.getOwners();

      setOwners(data.owners || []);
    } catch (error) {
      console.error("Failed to fetch owners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ADD OWNER
  const handleAddOwner = async () => {
    const newOwner: OwnerRegistrationData = {
      email: "virat18@gmail.com",
      name: "Virat",
      phone_number: "7455545454",
      area_name: "BTM LAYOUT",
      city: "Bengaluru",
      state: "Karnataka",
      zip_code: "560020",
    };

    try {
      await superAdminApi.addOwner(newOwner);

      // Refresh owner list
      fetchOwners();

      alert("Owner Added Successfully");
    } catch (error) {
      console.error("Failed to add owner:", error);
      alert("Failed to add owner");
    }
  };

  return (
    <>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#27272a] border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  S.No
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Owner Name
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Email
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Phone
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500 dark:text-white" />

                      <p>Loading owners...</p>
                    </div>
                  </td>
                </tr>
              ) : owners.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No owners registered yet.
                  </td>
                </tr>
              ) : (
                owners.map((owner, index) => (
                  <tr
                    key={owner.id || index}
                    onClick={() => setSelectedOwner(owner)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-bold">
                      {owner.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {owner.email}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {owner.phone_number}
                    </td>

                    <td className="px-6 py-4">
                      {owner.is_active ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center bg-emerald-100 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-red-500"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE PANEL */}
      {selectedOwner && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedOwner(null)}
          />

          {/* PANEL */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#18181b] shadow-2xl flex flex-col h-full">
            <div className="p-8 overflow-y-auto h-full">
              {/* CLOSE BUTTON */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setSelectedOwner(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* HEADER */}
              <div className="mb-8">
                <h2 className="text-[#121110] dark:text-whitexl font-bold text-gray-900 dark:text-white">
                  {selectedOwner.name}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {selectedOwner.city || selectedOwner.state 
                    ? `${selectedOwner.city || ''}${selectedOwner.city && selectedOwner.state ? ', ' : ''}${selectedOwner.state || ''}`
                    : 'Location not specified'}
                </p>
              </div>

              {/* TABS */}
              <div className="flex space-x-8 border-b border-gray-200 dark:border-white/10 mb-8">
                {["Overview", "Contact"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium border-b-2 ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600 dark:text-white"
                        : "border-transparent text-gray-400"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* OVERVIEW */}
              {activeTab === "Overview" && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Location Details
                  </h3>

                  <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-start space-x-4">
                    <div className="bg-gray-50 dark:bg-[#27272a] p-2.5 rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedOwner.area_name ? (
                        <>
                          <p>{selectedOwner.area_name}</p>
                          <p>
                            {selectedOwner.city}{selectedOwner.city && selectedOwner.state ? ', ' : ''}
                            {selectedOwner.state}{selectedOwner.zip_code ? ` - ${selectedOwner.zip_code}` : ''}
                          </p>
                        </>
                      ) : (
                        <p>No location details available.</p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 mt-8">
                    Portfolio Summary
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                      <p className="text-xs text-blue-600 dark:text-white font-semibold mb-1">Total</p>
                      <p className="text-xl font-bold text-blue-900">{selectedOwner.total_buildings}</p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                      <p className="text-xs text-emerald-600 font-semibold mb-1">Residential</p>
                      <p className="text-xl font-bold text-emerald-900">{selectedOwner.residential_count}</p>
                    </div>
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                      <p className="text-xs text-purple-600 font-semibold mb-1">Commercial</p>
                      <p className="text-xl font-bold text-purple-900">{selectedOwner.commercial_count}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT */}
              {activeTab === "Contact" && (
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Email
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOwner.email}
                    </p>
                  </div>

                  <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Phone
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOwner.phone_number}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}