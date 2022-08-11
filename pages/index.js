import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [presignedUrl, setPresignedUrl] = useState();

  const onDrop = useCallback(async (files) => {
    try {
      // Get file.
      const file = files[0];

      // Call API to get presigned url.
      const {
        data: { url },
      } = await axios.post("/api/upload", { name: file.name, type: file.type });

      // Update state.
      setPresignedUrl(url);

      // Upload file to S3.
      await axios.put(url, file);

      // Get trimmed url.
      const trimmedUrl = new URL(url);
      trimmedUrl.search = "";

      // Update state.
      setImageUrl(trimmed.href);
    } catch (error) {
      setErrorMessage(error.toString());
      throw error;
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Image Upload Example</h1>
        <div
          className={styles.card}
          style={{ marginTop: "60px" }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p className={styles.description}>
            Drag and drop or click to choose file.
          </p>
        </div>
        <div style={{ backgroundColor: "#F0F0F0", padding: "20px" }}>
          <p>Presigned URL: {presignedUrl}</p>
        </div>
        {imageUrl && (
          <div>
            <img src={imageUrl} alt="Nick Cage" style={{ width: "200px" }} />
          </div>
        )}
        {errorMessage && (
          <div
            style={{
              backgroundColor: "Red",
              color: "White",
              padding: "20px",
              marginTop: "20px",
            }}
          >
            <p>{errorMessage}</p>
          </div>
        )}
      </main>
    </div>
  );
}
