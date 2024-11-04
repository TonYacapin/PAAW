import { AttachFile } from '@mui/icons-material'
import React from 'react'


function Attachment({ handleAttachFile }) {
// Sana all Attached
  return (
    <div className="flex">
    <label htmlFor="fileinput" className="w-max grow">
      <div className=" bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen shadow-md text-center">
        <AttachFile /> Attach File
      </div>
      <input
        id="fileinput"
        type="file"
        accept=".csv"
        onChange={handleAttachFile}
        style={{ display: "none" }}
      />
    </label>
  </div>
  )
}

export default Attachment