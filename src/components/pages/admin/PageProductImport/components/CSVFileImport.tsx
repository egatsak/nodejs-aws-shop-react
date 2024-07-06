import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { useRetrieveProductsCsvUploadUrl } from "~/queries/products";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | undefined>();
  const [enabled, setEnabled] = React.useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const response = useRetrieveProductsCsvUploadUrl(url, enabled, file?.name);

  React.useEffect(() => {
    if (enabled && file) {
      uploadFile(file);
    }
  }, [enabled, file]);

  const removeFile = () => {
    setFile(undefined);
    setEnabled(false);
  };

  const uploadFile = async (file: File) => {
    console.log("uploadFile to", url);

    if (file) {
      console.log("File to upload: ", file.name);

      if (response.data?.uploadUrl) {
        console.log("Uploading to: ", response.data?.uploadUrl);
        const result = await axios.put(response.data.uploadUrl, file);
        console.log("Result: ", result);
      }

      setEnabled(false);
      setFile(undefined);
    }
  };

  const onUploadClick = () => {
    setEnabled(true);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={onUploadClick}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
