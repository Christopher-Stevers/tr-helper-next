import React from "react";
import axios from "axios";

const Downloader = ({
  filePath = "",
  name,
}: {
  filePath: string | null;
  name: string;
}) => {
  const watchFile = filePath?.replace("uploads\\", "") ?? "";
  const handleDownload = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/download`,
      {
        params: {
          filePath: filePath,
        },
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", watchFile);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <button className="border border-white " onClick={handleDownload}>
      Download {name} with filename {watchFile}
    </button>
  );
};

export default Downloader;
