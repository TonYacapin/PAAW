import { Download, Save, Upload } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import React from "react";

export default function FormSubmit(props) {
  return (
    <div className="flex md:flex-row flex-col gap-x-5 md:min-h-2 2xs:min-h-2">
      <div className="flex">
        <label htmlFor="fileinput" className="w-max">
          <div className=" bg-darkgreen text-white py-2 px-4  w-max rounded hover:bg-darkergreen shadow-md">
            <Download /> Load Form Progress
          </div>
          <input
            id="fileinput"
            type="file"
            accept=".csv"
            onChange={props.handleImportCSV}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="grow shrink" />
      <div className="flex space-x-4 md:flex-row flex-col">
        <button
          onClick={props.handleExportCSV}
          className="bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen shadow-md"
        >
          <Save /> Save Form As CSV
        </button>
        <button
          onClick={props.handleSubmit}
          className="bg-pastelyellow text-black py-2 px-4 rounded hover:bg-darkerpastelyellow shadow-md"
        >
          <Upload /> Submit {useMediaQuery("(min-width:600px)") && "form"}
        </button>
      </div>
    </div>
  );
}
