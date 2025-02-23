"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { SelectComponent } from "@/components/global/select-component";
import { SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Phone, Search, Hospital, Shield, Siren, Car } from "lucide-react";
import { emergencyContacts } from "@/constants";
import { filterContacts } from "@/lib/helpers";

const divisions = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const districtsByDivision = {
  dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail"],
  chittagong: ["Chittagong", "Cox's Bazar", "Comilla", "Chandpur"],
};

const EmergencyPage = () => {
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Hospitals",
      icon: Hospital,
      color: "text-red-500",
      data: filterContacts(
        emergencyContacts.hospitals,
        searchQuery,
        selectedDivision,
        selectedDistrict
      ),
    },
    {
      title: "Police Stations",
      icon: Shield,
      color: "text-blue-500",
      data: filterContacts(
        emergencyContacts.policeStations,
        searchQuery,
        selectedDivision,
        selectedDistrict
      ),
    },
    {
      title: "Fire Services",
      icon: Siren,
      color: "text-orange-500",
      data: filterContacts(
        emergencyContacts.fireServices,
        searchQuery,
        selectedDivision,
        selectedDistrict
      ),
    },
    {
      title: "Ambulance Services",
      icon: Car,
      color: "text-green-500",
      data: filterContacts(
        emergencyContacts.ambulanceServices,
        searchQuery,
        selectedDivision,
        selectedDistrict
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Emergency Contacts
          </h2>
          <p className="text-muted-foreground">
            Find emergency services contact information across Bangladesh
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Siren className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="font-semibold text-red-500">Emergency: 999</span>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emergency services..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <SelectComponent
              selectValue="Select Division"
              value={selectedDivision}
              onValueChange={(value) => {
                setSelectedDivision(value);
                setSelectedDistrict("");
              }}
              content={
                <>
                  <SelectItem value="all">All Divisions</SelectItem>
                  {divisions.map((division) => (
                    <SelectItem
                      key={division.toLowerCase()}
                      value={division.toLowerCase()}
                    >
                      {division}
                    </SelectItem>
                  ))}
                </>
              }
            />
            <SelectComponent
              selectValue="Select District"
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
              disabled={!selectedDivision || selectedDivision === "all"}
              content={
                <>
                  <SelectItem value="all">All Districts</SelectItem>
                  {selectedDivision &&
                    selectedDivision !== "all" &&
                    districtsByDivision[
                      selectedDivision as keyof typeof districtsByDivision
                    ]?.map((district) => (
                      <SelectItem
                        key={district.toLowerCase()}
                        value={district.toLowerCase()}
                      >
                        {district}
                      </SelectItem>
                    ))}
                </>
              }
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.title} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <category.icon className={`w-5 h-5 ${category.color}`} />
              <h2 className="font-semibold">{category.title}</h2>
            </div>
            <div className="space-y-3">
              {category.data.length > 0 ? (
                category.data.map((item: any) => (
                  <div key={item.name} className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium">{item.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{item.phone}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.address}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  No {category.title.toLowerCase()} found
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmergencyPage;
