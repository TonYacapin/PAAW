import { Download, Save, Upload } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import React, { useContext } from "react";
import { OfflineContext } from "../App";

export default function FormSubmit(props) {
  const isOffline = useContext(OfflineContext);
  function SubmitText() {
    if (useMediaQuery("(min-width:600px)")) {
      return "Submit form";
    } else {
      return "Submit";
    }
  }
  return (
    <div className="flex md:flex-row flex-col gap-x-5 md:min-h-2 gap-y-10 2xs:min-h-2 mt-4">
      <div className="flex">
        <label htmlFor="fileinput" className="w-max grow">
          <div className=" bg-darkgreen text-white py-2 px-4  rounded hover:bg-darkergreen shadow-md text-center">
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

      <div className="md:grow md:shrink" />
      <div className="flex md:space-x-4 md:flex-row flex-col gap-y-3">
        <button
          onClick={props.handleExportCSV}
          className="bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen shadow-md"
        >
          <Save /> Save Form As CSV
        </button>
        {!(isOffline) && (
          <button
            onClick={props.handleSubmit}
            className="bg-pastelyellow text-black py-2 px-4 rounded hover:bg-darkerpastelyellow shadow-md"
          >
            <Upload /> {SubmitText()}
          </button>
        )}
      </div>
    </div>
  );
}
