import React, { useEffect } from "react";
import CardBox from "../component/CardBox";
import NVLogo from "./assets/NVLOGO.png";
import DALogo from "./assets/DALOGO.png";

function AboutUs() {
  return (
    <>
      <div className="flex flex-1 flex-col p-4 lg:p-8 mb-4">
        <h1 className="lg:text-3xl sm:text-xl font-semibold text-black mb-2 sm:mb-4 text-left">
          About Us
        </h1>
        <CardBox>
          <div className="lg:h-[80vh] lg:overflow-y-auto flex flex-col items-center gap-2 p-3">
            <div className="flex flex-row gap-6 w-fit h-auto">
              <img
                src={NVLogo}
                alt="Provincial Seal"
                className="w-40 h-40 object-contain"
              />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold text-black mt-4 mb-2">
                Province of Nueva Vizcaya
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h1 className="text-lg font-semibold text-black mt-4 mb-2">
                  Vision
                </h1>
                <p>
                  Provincial Government of Nueva Vizcaya is a leading local
                  government unit governed by God-fearing leaders who are
                  accountable, competent, and responsive, resulting to inclusive
                  socio-economic growth and better quality of life for its
                  people
                </p>
              </div>

              <div className="text-center">
                <h1 className="text-lg font-semibold text-black mt-4 mb-2">
                  Mission
                </h1>
                <p>
                  We ensure effective and efficient governance and delivery of
                  services essential for the general welfare of its constituency
                </p>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold text-black mt-4 mb-2">
                Provincial Veterinary Services Office
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h1 className="text-lg font-semibold text-black mt-4 mb-2">
                  Organizational Outcome
                </h1>
                <ul className="list-disc list-inside">
                  <li>
                    Increase meat supply, improved per capita income, livestock
                    and poultry productivity within ecological limit
                  </li>
                  <li>Improved access to reliable and updated information</li>
                  <li>Increase agricultural production</li>
                </ul>
                <p></p>
              </div>

              <div className="text-center">
                <h1 className="text-lg font-semibold text-black mt-4 mb-2">
                  Sectoral Outcome
                </h1>
                <p>Ensure inclusive wealth generation</p>
                <h1 className="text-lg font-semibold text-black mt-4 mb-2">
                  Major Final Output
                </h1>
                <p>Veterinary Regulation Services</p>
              </div>
            </div>
          </div>
        </CardBox>
      </div>
    </>
  );
}

export default AboutUs;
