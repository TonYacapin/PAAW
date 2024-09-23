import { Download, Save, Upload } from '@mui/icons-material'
import React from 'react'

export default function FormSubmit(props) {
  return (
    <div className="flex flex-row">
    <label htmlFor="fileinput">
      <div className="bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen shadow-md">
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
    <div className="grow" />
    <div className="flex space-x-4">
      <button
        onClick={props.handleExportCSV}
        className=" bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen shadow-md"
      >
        <Save/> Save Form As CSV
      </button>
      <button
        onClick={props.handleSubmit}
        className="bg-pastelyellow text-black py-2 px-4 rounded hover:bg-darkerpastelyellow shadow-md"
      >
        <Upload/> Submit Form
      </button>
    </div>
  </div>
  )
}