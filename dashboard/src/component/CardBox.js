import React from 'react';

export default function CardBox(props) {
  return (
    <div className="lg:border p-4 lg:rounded-lg lg:mb-6 lg:shadow-md bg-white">
      {props.children}
    </div>
  );
}