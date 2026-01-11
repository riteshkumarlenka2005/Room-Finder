"use client";
import { useState } from "react";
import Image from "next/image";

export default function UploadTest() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.url) {
      setUrl(data.url);
    } else {
      alert("Upload failed");
      console.error("UPLOAD ERROR:", data);

    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Test Page</h2>
      <input type="file" onChange={handleUpload} />

      {loading && <p>Uploading...</p>}

      {url && (
        <div>
          <p>Uploaded Image URL:</p>
          <Image src={url} width={200} height={200} alt="Uploaded file" />
          <p>{url}</p>
        </div>
      )}
    </div>
  );
}
