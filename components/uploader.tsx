"use client";
import React, { useState } from "react";
import axios from "axios";
import Downloader from "./downloader";

// Define the type for formData to avoid implicit 'any' type
type FormData = {
  series: string;
  artist: string;
  episodeName: string;
  episodeNumber: string;
  comment: string;
  [key: string]: string;
};

const Uploader = () => {
  const [file, setFile] = useState<File | null>(null); // Specify the type for file state
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [watchFolder, setWatchFolder] = useState<string | null>(null); // Specify the type for watchFolder state
  const [previewFilePath, setPreviewFilePath] = useState<string | null>(null);
  const [duplicateFilePath, setDuplicateFilePath] = useState<string | null>(
    null
  );
  const [newXmlFilePath, setNewXmlFilePath] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    series: "",
    artist: "",
    episodeName: "",
    episodeNumber: "",
    comment: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Specify the type for e parameter
    setFile(e.target.files ? e.target.files[0] : null); // Check if files exist before setting file
  };
  const handleXmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Specify the type for e parameter
    setXmlFile(e.target.files ? e.target.files[0] : null); // Check if files exist before setting file
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Specify the type for e parameter
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Specify the type for e parameter
    e.preventDefault();
    const data = new FormData();
    if (file) {
      // Check if file is not null before appending
      data.append("mp3File", file); // Adjusted field name to match API route
    }
    if (xmlFile) {
      // Check if file is not null before appending
      data.append("xmlFile", xmlFile); // Adjusted field name to match API route
    }
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/processFile`,
      data
    );
    const { newFilePath, previewFilePath, duplicateFilePath, newXmlFilePath } =
      response.data;
    console.log("New file path:", response.data);
    console.log("New file path:", response.data);

    const checkFileMatch = async () => {
      const fileName = newFilePath;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/checkfile`,
          {
            params: {
              fileName,
            },
          }
        );
        if (response.data.message === "File matches") {
          setWatchFolder(newFilePath);
          setPreviewFilePath(previewFilePath);
          setDuplicateFilePath(duplicateFilePath);
          setNewXmlFilePath(newXmlFilePath);
          return true;
        }
      } catch (error) {
        console.error("Error checking file match:", error);
      }
    };
    let isMatch = false;
    while (!isMatch) {
      isMatch = (await checkFileMatch()) ?? false;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            Welcome to TR episode formatter by christopher.stevers1@gmail.com.
          </div>
          <div>
            Please make sure you always use a different episode number from the
            one before and upload a mp3 and xml file.
          </div>
          <label htmlFor="mp3File">MP3 File:</label>
          <input
            type="file"
            name="mp3File"
            onChange={handleFileChange}
            className="border p-2 text-white"
          />
          <label htmlFor="file">XML File:</label>
          <input
            type="file"
            name="xmlFile"
            onChange={handleXmlFileChange}
            className="border p-2 text-white"
          />
          <label htmlFor="series">Series:</label>
          <input
            type="text"
            name="series"
            onChange={handleInputChange}
            className="border p-2 text-black"
          />
          <label htmlFor="artist">Artist:</label>
          <input
            type="text"
            name="artist"
            onChange={handleInputChange}
            className="border p-2 text-black"
          />
          <label htmlFor="episodeName">Episode Name:</label>
          <input
            type="text"
            name="episodeName"
            onChange={handleInputChange}
            className="border p-2 text-black"
          />
          <label htmlFor="episodeNumber">Episode Number:</label>
          <input
            type="text"
            name="episodeNumber"
            onChange={handleInputChange}
            className="border p-2 text-black"
          />
          <label htmlFor="comment">Date:</label>
          <input
            type="text"
            name="comment"
            onChange={handleInputChange}
            className="border p-2 text-black"
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            onChange={handleInputChange}
            className="border p-2 text-black"
          />
          <button type="submit">Submit</button>
        </form>
        <div className="flex flex-col gap-6">
          {watchFolder && <Downloader filePath={watchFolder} name="website" />}
          {previewFilePath && (
            <Downloader filePath={previewFilePath} name="preview" />
          )}
          {duplicateFilePath && (
            <Downloader filePath={duplicateFilePath} name="file for xml" />
          )}
          {newXmlFilePath && (
            <Downloader filePath={newXmlFilePath} name="xml" />
          )}
        </div>
      </div>
    </>
  );
};

export default Uploader;
