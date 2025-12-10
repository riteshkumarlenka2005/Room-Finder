"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step1({ data, setData, setStep }: any) {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};

    if (!data.title.trim()) newErrors.title = "Property title is required";
    if (!data.propertyType.trim()) newErrors.propertyType = "Property type is required";
    if (!data.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep(2);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow">

      {/* Property Title */}
      <div className="mb-5">
        <Label>Property Title *</Label>
        <Input
          placeholder="e.g., Spacious 2BHK near GIET College"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Property Type */}
      <div className="mb-5">
        <Label>Property Type *</Label>
        <select
          className="w-full border rounded-md p-2"
          value={data.propertyType}
          onChange={(e) => setData({ ...data, propertyType: e.target.value })}
        >
          <option value="">Select property type</option>
          <option>Room</option>
          <option>Flat</option>
          <option>House</option>
          <option>PG</option>
        </select>
        {errors.propertyType && (
          <p className="text-red-600 text-sm mt-1">{errors.propertyType}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <Label>Description *</Label>
        <textarea
          className="w-full border rounded-md p-2"
          placeholder="Describe your property..."
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end">
        <Button onClick={handleNext}>Next Step</Button>
      </div>
    </div>
  );
}
