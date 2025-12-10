"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { uploadImage } from "@/lib/upload";
import { requireAuth } from "@/lib/checkAuth";
import { useEffect } from "react";

import AuthGuard from "@/components/AuthGuard";

import { Home, Upload, Plus, Minus, IndianRupee, CheckCircle, Camera } from "lucide-react"
import Link from "next/link"
type FormDataType = {
  // Basic Info
  title: string;
  description: string;
  propertyType: string;

  // Location
  state: string;
  district: string;
  city: string;
  area: string;
  fullAddress: string;
  pincode: string;

  // Room Details
  bhk: string;
  doors: number;
  windows: number;
  flooring: string;
  balcony: boolean;
  roofAccess: boolean;

  // Utilities
  waterSystem: string;
  electricity: string;
  parking: string;

  // Pricing
  monthlyRent: string;
  securityDeposit: string;

  // Amenities
  amenities: string[];
  furniture: string[];

  // Kitchen & Maushi
  kitchenType: string;
  maushiAvailable: boolean;
  maushiCost: string;

  // Images
  images: string[];

  // Contact
  ownerName: string;
  phone: string;
  alternatePhone: string;

  // Preferences
  preferredTenants: string[];
  rules: string[];
};
export default function ListPropertyPage() {

  useEffect(() => {
  requireAuth();
}, []);



  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
      
    // Basic Info
    title: "",
    description: "",
    propertyType: "",

    // Location
    state: "",
    district: "",
    city: "",
    area: "",
    fullAddress: "",
    pincode: "",

    // Room Details
    bhk: "",
    doors: 1,
    windows: 1,
    flooring: "",
    balcony: false,
    roofAccess: false,

    // Utilities
    waterSystem: "",
    electricity: "",
    parking: "",

    // Pricing
    monthlyRent: "",
    securityDeposit: "",

    // Amenities
    amenities: [],
    furniture: [],

    // Kitchen & Maushi
    kitchenType: "",
    maushiAvailable: false,
    maushiCost: "",

    // Images
    images: [],

    // Contact
    ownerName: "",
    phone: "",
    alternatePhone: "",

    // Preferences
    preferredTenants: [],
    rules: [],
});

  const steps = [
    { id: 1, title: "Basic Info", description: "Property details" },
    { id: 2, title: "Location", description: "Address & location" },
    { id: 3, title: "Room Details", description: "Structure & specifications" },
    { id: 4, title: "Amenities", description: "Facilities & furniture" },
    { id: 5, title: "Pricing", description: "Rent & deposits" },
    { id: 6, title: "Photos", description: "Property images" },
    { id: 7, title: "Contact", description: "Owner information" },
  ]

  const propertyTypes = ["1BHK", "2BHK", "3BHK", "Single Room", "Shared Room", "PG", "Hostel"]
  const flooringOptions = ["Tiles", "Marble", "Cement", "Wooden", "Vitrified"]
  const waterSystems = ["24/7 Municipal", "Bore Well", "Tanker Supply", "Mixed Supply"]
  const electricityOptions = ["Separate Meter", "Included in Rent", "Shared Meter"]
  const parkingOptions = ["2-Wheeler Only", "4-Wheeler Only", "Both Available", "No Parking"]
  const kitchenTypes = ["Modular Kitchen", "Basic Kitchen", "Shared Kitchen", "No Kitchen"]

  const amenitiesList = [
    "WiFi",
    "AC",
    "Geyser",
    "Washing Machine",
    "Refrigerator",
    "TV",
    "Security Guard",
    "CCTV",
    "Power Backup",
    "Lift",
    "Garden",
    "Gym",
  ]

  const furnitureList = [
    "Bed",
    "Mattress",
    "Study Table",
    "Chair",
    "Wardrobe",
    "Fan",
    "Light",
    "Curtains",
    "Sofa",
    "Dining Table",
    "TV Unit",
    "Shoe Rack",
  ]

  const handleInputChange = (field: string, value: string | number | boolean) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

const handleArrayToggle = (field: string, item: string) => {
  setFormData((prev) => {
    const current = (prev as Record<string, any>)[field];  // Fix here!
    const array = Array.isArray(current) ? (current as string[]) : [];

    return {
      ...prev,
      [field]: array.includes(item)
        ? array.filter((i) => i !== item)
        : [...array, item],
    };
  });
};



const handleSubmit = async () => {
  const payload = {
    title: formData.title,
    description: formData.description,
    property_type: formData.propertyType,
    state: formData.state,
    district: formData.district,
    city: formData.city,
    area: formData.area,
    full_address: formData.fullAddress,
    pincode: formData.pincode,
    bhk: formData.bhk,
    doors: formData.doors,
    windows: formData.windows,
    flooring: formData.flooring,
    balcony: formData.balcony,
    roof_access: formData.roofAccess,
    water_system: formData.waterSystem,
    electricity: formData.electricity,
    parking: formData.parking,
    monthly_rent: formData.monthlyRent,
    security_deposit: formData.securityDeposit,
    amenities: formData.amenities,
    furniture: formData.furniture,
    kitchen_type: formData.kitchenType,
    maushi_available: formData.maushiAvailable,
    maushi_cost: formData.maushiCost,
    images: formData.images,
    owner_name: formData.ownerName,
    phone: formData.phone,
    alternate_phone: formData.alternatePhone,
    preferred_tenants: formData.preferredTenants,
    rules: formData.rules
  };

  try {
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert("Property saved successfully!");
    console.log("PROPERTY SAVED:", data);

  } catch (error) {
    alert("Failed to save property");
    console.error(error);
  }
};




  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }





  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${step.id < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">{steps[currentStep - 1].title}</p>
            <p className="text-sm text-gray-500">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Spacious 2BHK near GIET College"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <select
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange("propertyType", e.target.value)}
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, nearby facilities, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="e.g., Odisha"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="e.g., Rayagada"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City/Town</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Gunupur"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area/Locality</Label>
                    <Input
                      id="area"
                      placeholder="e.g., Sector 7"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fullAddress">Full Address</Label>
                  <Textarea
                    id="fullAddress"
                    placeholder="Complete address with landmarks..."
                    value={formData.fullAddress}
                    onChange={(e) => handleInputChange("fullAddress", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    placeholder="e.g., 765022"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Room Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="bhk">BHK Type</Label>
                  <select
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.bhk}
                    onChange={(e) => handleInputChange("bhk", e.target.value)}
                  >
                    <option value="">Select BHK</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Number of Doors</Label>
                    <div className="flex items-center space-x-3 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("doors", Math.max(1, formData.doors - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{formData.doors}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("doors", formData.doors + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Number of Windows</Label>
                    <div className="flex items-center space-x-3 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("windows", Math.max(1, formData.windows - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{formData.windows}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("windows", formData.windows + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="flooring">Flooring Type</Label>
                  <select
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.flooring}
                    onChange={(e) => handleInputChange("flooring", e.target.value)}
                  >
                    <option value="">Select flooring</option>
                    {flooringOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="waterSystem">Water System</Label>
                    <select
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={formData.waterSystem}
                      onChange={(e) => handleInputChange("waterSystem", e.target.value)}
                    >
                      <option value="">Select water system</option>
                      {waterSystems.map((system) => (
                        <option key={system} value={system}>
                          {system}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="electricity">Electricity</Label>
                    <select
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={formData.electricity}
                      onChange={(e) => handleInputChange("electricity", e.target.value)}
                    >
                      <option value="">Select electricity option</option>
                      {electricityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="parking">Parking</Label>
                    <select
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={formData.parking}
                      onChange={(e) => handleInputChange("parking", e.target.value)}
                    >
                      <option value="">Select parking option</option>
                      {parkingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="balcony"
                      checked={formData.balcony}
                      onCheckedChange={(checked:boolean) => handleInputChange("balcony", checked)}
                    />
                    <Label htmlFor="balcony">Balcony Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="roofAccess"
                      checked={formData.roofAccess}
                      onCheckedChange={(checked:boolean) => handleInputChange("roofAccess", checked)}
                    />
                    <Label htmlFor="roofAccess">Roof Access</Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Amenities */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Amenities</Label>
                  <div className="grid md:grid-cols-3 gap-3 mt-3">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => handleArrayToggle("amenities", amenity)}
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Furniture</Label>
                  <div className="grid md:grid-cols-3 gap-3 mt-3">
                    {furnitureList.map((furniture) => (
                      <div key={furniture} className="flex items-center space-x-2">
                        <Checkbox
                          id={`furniture-${furniture}`}
                          checked={formData.furniture.includes(furniture)}
                          onCheckedChange={() => handleArrayToggle("furniture", furniture)}
                        />
                        <Label htmlFor={`furniture-${furniture}`} className="text-sm">
                          {furniture}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="kitchenType">Kitchen Type</Label>
                  <select
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={formData.kitchenType}
                    onChange={(e) => handleInputChange("kitchenType", e.target.value)}
                  >
                    <option value="">Select kitchen type</option>
                    {kitchenTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maushiAvailable"
                      checked={formData.maushiAvailable}
                      onCheckedChange={(checked:boolean) => handleInputChange("maushiAvailable", checked)}
                    />
                    <Label htmlFor="maushiAvailable">Maushi Service Available</Label>
                  </div>

                  {formData.maushiAvailable && (
                    <div>
                      <Label htmlFor="maushiCost">Domestic helper Cost (per person/month)</Label>
                      <div className="relative mt-1">
                        <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="maushiCost"
                          placeholder="e.g., 1500"
                          value={formData.maushiCost}
                          onChange={(e) => handleInputChange("maushiCost", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Pricing */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent</Label>
                  <div className="relative mt-1">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="monthlyRent"
                      placeholder="e.g., 4500"
                      value={formData.monthlyRent}
                      onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="securityDeposit">Security Deposit</Label>
                  <div className="relative mt-1">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="securityDeposit"
                      placeholder="e.g., 4500"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Pricing Summary</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span>₹{formData.monthlyRent || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Deposit:</span>
                      <span>₹{formData.securityDeposit || "0"}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                      <span>Total Initial Cost:</span>
                      <span>
                        ₹
                        {Number.parseInt(formData.monthlyRent || "0") +
                          Number.parseInt(formData.securityDeposit || "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

{/* Step 6: Photos */}
{currentStep === 6 && (
  <div className="space-y-6">
    <div>
      <Label className="text-base font-medium">Property Photos</Label>
      <p className="text-sm text-gray-500 mt-1">
        Upload high-quality images of your property
      </p>
    </div>

    {/* Upload Container */}
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h3>
      <p className="text-gray-500 mb-4">Click below to choose photos</p>

      {/* Hidden File Input */}
      <input
        id="propertyImagesInput"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = e.target.files;
          if (!files) return;

          const uploadedUrls: string[] = [];

          for (const file of Array.from(files)) {
            try {
              const url = await uploadImage(file); // already working
              uploadedUrls.push(url);
            } catch (err) {
              console.error("Upload failed:", err);
              alert("Upload failed for some files.");
            }
          }

          setFormData((prev) => ({
            ...prev,
            images: uploadedUrls,
          }));

          alert("Photos uploaded successfully!");
        }}
      />

      {/* Button → triggers hidden input */}
      <Button
        variant="outline"
        onClick={() =>
          document.getElementById("propertyImagesInput")?.click()
        }
      >
        <Upload className="w-4 h-4 mr-2" />
        Choose Files
      </Button>
    </div>

    {/* Show Preview of Uploaded Photos */}
    {formData.images.length > 0 && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {formData.images.map((img, index) => (
          <img
            key={index}
            src={img}
            className="w-full h-32 object-cover rounded-lg border"
            alt="Property preview"
          />
        ))}
      </div>
    )}

    {/* Tips Section */}
    <div className="bg-yellow-50 p-4 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-2">Photo Tips</h4>
      <ul className="text-sm text-yellow-700 space-y-1">
        <li>• Upload at least 5 clear photos</li>
        <li>• Include bedroom, hall, kitchen, and bathroom</li>
        <li>• Use daylight for best results</li>
        <li>• Show exterior + common areas</li>
        <li>• Highlight unique features</li>
      </ul>
    </div>
  </div>
)}




            {/* Step 7: Contact */}
{currentStep === 7 && (
  <div className="space-y-6">
    <div>
      <Label htmlFor="ownerName">Owner Name</Label>
      <Input
        id="ownerName"
        placeholder="Enter your full name"
        value={formData.ownerName}
        onChange={(e) => handleInputChange("ownerName", e.target.value)}
        className="mt-1"
      />
    </div>

    <div>
      <Label htmlFor="phone">Primary Phone Number</Label>
      <Input
        id="phone"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        className="mt-1"
      />
    </div>

    <div>
      <Label htmlFor="alternatePhone">Alternate Phone Number (Optional)</Label>
      <Input
        id="alternatePhone"
        placeholder="Enter alternate phone number"
        value={formData.alternatePhone}
        onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
        className="mt-1"
      />
    </div>

    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-medium text-green-800 mb-2">Ready to List!</h4>
      <p className="text-sm text-green-700">
        Your property listing is almost ready. Review all details and submit to make it live.
      </p>
    </div>
  </div>
)}

{/* Navigation Buttons */}
<div className="flex justify-between mt-8 pt-6 border-t">
  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
    Previous
  </Button>

  {currentStep < steps.length ? (
    <Button onClick={nextStep}>Next Step</Button>
  ) : (
    <Button 
      onClick={async () => {
        try {
          const res = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const data = await res.json();
          console.log("Property Saved:", data);

          if (data.error) {
            alert("Error: " + data.error);
          } else {
            alert("Property Listed Successfully!");
          }
        } catch (error) {
          console.error("Submit Failed:", error);
          alert("Submit failed");
        }
      }}
      className="bg-green-600 hover:bg-green-700"
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      Submit Listing
    </Button>
  )}
</div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
