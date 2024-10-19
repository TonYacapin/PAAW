import React from "react";
import StepperComponent from "../component/StepperComponent";
import axiosInstance from "../component/axiosInstance";

const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null);
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const handleYearChange = (e) => {
  setSelectedYear(e.target.value);
};

const handleMonthChange = (e) => {
  setSelectedMonth(e.target.value);
};

function AccomplismentPerMunicipality() {
  const VaccineTreatment = [
    "Hemosep Carabao",
    "Hemosep Cattle",
    "Hemosep Goat/Sheep",
    "Rabies",
    "NCD Poultry",
    "Hog Cholera",
  ];

  const calculatePercentages = () => {
    if (selectedVaccine === "All") {
      const totalQuarterly = targets.totalTarget || 0;
      const totalSemiAnnual = targets.totalSemiAnnualTarget || 0;

      setSemiAnnualPercentage(
        totalSemiAnnual === 0
          ? "No target set"
          : `${((totals.total / totalSemiAnnual) * 100).toFixed(2)}%`
      );
    } else {
      const target = targets[selectedVaccine];
      if (!target) {
        setSemiAnnualPercentage("No target set");
        return;
      }

      const vaccineTotal = filteredSpeciesCount.reduce(
        (sum, species) => sum + species.combined,
        0
      );

      setQuarterlyPercentage(
        target.quarterly > 0
          ? `${((totals.combined / target.quarterly) * 100).toFixed(2)}%`
          : "No target set"
      );
      setSemiAnnualPercentage(
        target.semiAnnual > 0
          ? `${((totals.total / target.semiAnnual) * 100).toFixed(2)}%`
          : "No target set"
      );
    }
  };

  const processTargets = (targetsData) => {
    if (!targetsData || !targetsData.targets || !Array.isArray(targetsData.targets)) {
      console.error("Invalid targets data format:", targetsData);
      return;
    }

    const targetsObj = targetsData.targets.reduce((acc, target) => {
      acc[target.Type] = {
        semiAnnual: target.semiAnnualTarget
      };
      return acc;
    }, {});

    setTargets({
      ...targetsObj,
      totalSemiAnnualTarget: targetsData.totalSemiAnnualTarget
    });
  };
  const fetchData = async () => {
    try {
      const [speciesCountResponse, targetsResponse] = await Promise.all([
        axiosInstance.get(`/species-count?year=${selectedYear}&month=${selectedMonth}&vaccine=all`),
        axiosInstance.get(`/api/targets/accomplishment?year=${selectedYear}&reportType=VaccinationReport`)
      ]);

      processSpeciesCount(speciesCountResponse.data);
      processTargets(targetsResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-6 shadow-lg">
        <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-darkgreen text-white">
            <tr>
              <th className="py-3 px-4 text-left">Municipality</th>
              <th className="py-3 px-4 text-left">Previous</th>
              <th className="py-3 px-4 text-left">Present</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Percent</th>
            </tr>
          </thead>
          <tbody>
            {VaccineTreatment.map((vt) => {
              <React.Fragment key={vaccineType}>
                <tr
                  key={speciesData.species}
                  className="border-b border-[#1b5b40] hover:bg-[#f9f9f9]"
                >
                  <td className="py-2 px-4 font-bold" colSpan="6">
                    {vaccineType}
                  </td>
                  {speciesUnderVaccine.map((speciesData) => (
                    <>
                      <td className="py-2 px-4"></td>
                      <td className="py-2 px-4 text-[#252525]">
                        {speciesData.species + "(hds)"}
                      </td>
                      <td className="py-2 px-4 text-[#252525]">
                        {speciesData.previousMonth}
                      </td>
                      <td className="py-2 px-4 text-[#252525]">
                        {speciesData.thisMonth}
                      </td>
                      <td className="py-2 px-4 text-[#252525]">
                        {speciesData.combined}
                      </td>
                      <td className="py-2 px-4 text-[#252525]">
                        {speciesData.total}
                      </td>
                    </>
                  ))}
                </tr>
              </React.Fragment>;
            })}
            <tr className="bg-[#ffe356] font-bold text-[#1b5b40]">
              <td colSpan="2" className="py-3 px-4">
                Total
              </td>
              <td className="py-3 px-4">{totals.previousMonth}</td>
              <td className="py-3 px-4">{totals.thisMonth}</td>
              <td className="py-3 px-4">{totals.combined}</td>
              <td className="py-3 px-4">{totals.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <StepperComponent />
    </>
  );
}

export default AccomplismentPerMunicipality;
