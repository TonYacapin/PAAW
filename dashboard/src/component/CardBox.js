import React from 'react'

export default function CardBox(props) {
  return (
    <div className="border p-4 rounded-lg mb-6 shadow-md bg-white pb-10">
        {props.content}
    </div>
  )
}