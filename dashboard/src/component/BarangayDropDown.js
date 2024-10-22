import React, { useEffect, useState } from "react";

const brgyALC = [
  "Abuyo",
  "Cawayan",
  "Galintuja",
  "Lipuga",
  "Lublub",
  "Pelaway",
];

const brgyAMB = [
  "Ammoweg",
  "Camandag",
  "Dulli",
  "Labang",
  "Napo",
  "Poblacion",
  "Salingsingan",
  "Tiblac",
];

const brgyARI = [
  "Anayo",
  "Baan",
  "Banganan",
  "Balite",
  "Beti",
  "Bone North",
  "Bone South",
  "Calitlitan",
  "Canabuan",
  "Canarem",
  "Comon",
  "Cutar",
  "Darapidap",
  "Kirang",
  "Latar-Nocnoc-San Francisco",
  "Nagcuartelan",
  "Ocao-Capiniaan",
  "Poblacion",
  "Sta. Clara",
  "Tabueng",
  "Tucanon",
  "Yaway",
];

const brgyBAG = [
  "Bakir",
  "Baretbet",
  "Careb",
  "Lantap",
  "Murong",
  "Nangalisan",
  "Paniki",
  "Pogonsino",
  "San Geronimo",
  "San Pedro",
  "Sta. Cruz",
  "Sta. Lucia",
  "Tuao North",
  "Tuao South",
  "Villa Coloma",
  "Villa Quirino",
  "Villaros",
];

const brgyBAM = [
  "Abian",
  "Abinganan",
  "Aliaga",
  "Almaguer North",
  "Almaguer South",
  "Banggot",
  "Barat",
  "Buag",
  "Calaocan",
  "Dullao",
  "Homestead",
  "Indiana",
  "Mabuslo",
  "Macate",
  "Magsaysay Hill",
  "Manamtam",
  "Mauan",
  "Pallas",
  "Salinas",
  "San Antonio North",
  "San Antonio South",
  "San Fernando",
  "San Leonardo",
  "Santo Domingo Proper",
  "Santo Domingo West",
];

const brgyBAY = [
  "Bansing",
  "Bonfal East",
  "Bonfal Proper",
  "Bonfal West",
  "Buenavista",
  "Busilac",
  "Cabuaan",
  "Casat",
  "District IV",
  "Don Domingo Maddela",
  "Don Mariano Marcos",
  "Don Mariano Perez",
  "Don Tomas Maddela",
  "Ipil-Cuneg",
  "La Torre North",
  "La Torre South",
  "Luyang",
  "Magapuy",
  "Magsaysay",
  "Masoc",
  "Paitan",
  "Salvacion",
  "San Nicolas",
  "Santa Rosa",
  "Vista Alegre",
];

const brgyDIA = [
  "Ampakleng",
  "Arwas",
  "Balete",
  "Bugnay",
  "Butao",
  "Decabacan",
  "Duruarog",
  "Escoting",
  "Langka",
  "Lurad",
  "Nagsabaran",
  "Namamparan",
  "Pinya",
  "Poblacion",
  "Rosario",
  "San Luis",
  "San Pablo",
  "Villa Aurora",
  "Villa Florentino",
];

const brgyDDN = [
  "Belance",
  "Binuangan",
  "Bitnong",
  "Bulala",
  "Inaban",
  "Ineangan",
  "Lamo",
  "Mabasa",
  "Macabenga",
  "Malasin",
  "Munguia",
  "New Gumiad",
  "Oyao",
  "Parai",
  "Yabbi",
];

const brgyDDS = [
  "Abaca",
  "Bagumbayan",
  "Balzain",
  "Banila",
  "Biruk",
  "Canabay",
  "Carolotan",
  "Domang",
  "Dopaj",
  "Gabut",
  "Ganao",
  "Kimbutan",
  "Kinabuan",
  "Lukidnon",
  "Mangayang",
  "Palabotan",
  "Santa Maria",
  "Sanguit",
  "Talbek",
];

const brgyKAS = [
  "Alloy",
  "Alimit",
  "Antutot",
  "Belet",
  "Binogawan",
  "Biyoy",
  "Bua",
  "Camamasi",
  "Capisaan",
  "Catarawan",
  "Cordon",
  "Didipio",
  "Dine",
  "Kakiduguen",
  "Kongkong",
  "Lupa",
  "Macalong",
  "Malabing",
  "Muta",
  "Nantawakan",
  "Paquet",
  "Papaya",
  "Pao",
  "Poblacion",
  "Pudi",
  "Siguem",
  "Tadji",
  "Tukod",
  "Wangal",
  "Watwat",
];

const brgyKAY = [
  "Acacia",
  "Alang Salacsac",
  "Amelong Labeng",
  "Ansipsip",
  "Baan",
  "Babadi",
  "Balangabang",
  "Balete",
  "Banal",
  "Binalian",
  "Besong",
  "Buyasyas",
  "Cabalatan Alang",
  "Cabanglasan",
  "Cabayo",
  "Castillo Village",
  "Kayapa Proper East",
  "Kayapa Proper West",
  "Latbang",
  "Lawigan",
  "Mapayao",
  "Nansiakan",
  "Pampang",
  "Pangawan",
  "Pinayag",
  "Pingkian",
  "San Fabian",
  "Talicabcab",
  "Tidang Village",
  "Tubungan",
];

const brgyQUE = [
  "Aurora",
  "Baresbes",
  "Bonifacio",
  "Buliwao",
  "Calaocan",
  "Caliat",
  "Dagupan",
  "Darubba",
  "Maasin",
  "Maddiangat",
  "Nalubbunan",
  "Runruno",
];

const brgySTA = [
  "Atbu",
  "Bacneng",
  "Balete",
  "Baliling",
  "Bantinan",
  "Baracbac",
  "Buyasyas",
  "Canabuan",
  "Imugan",
  "Malico",
  "Poblacion",
  "Santa Rosa",
  "Sinapaoan",
  "Tactac",
  "Unib",
  "Villaflores",
];

const brgySOL = [
  "Aggub",
  "Bagahabag",
  "Bangaan",
  "Bangar",
  "Bascaran",
  "Communal",
  "Concepcion",
  "Curifang",
  "Dadap",
  "Lactawan",
  "Osmeña",
  "Pilar D. Galima",
  "Poblacion North",
  "Poblacion South",
  "Quezon",
  "Quirino",
  "Roxas",
  "San Juan",
  "San Luis",
  "Tucal",
  "Uddiawan",
  "Wacal",
];

const brgyVIL = [
  "Bintawan Norte",
  "Bintawan Sur",
  "Cabuluan",
  "Ibung",
  "Nagbitin",
  "Ocapon",
  "Pieza",
  "Poblacion",
  "Sawmill",
];

export const brgyAll = [
  { brgys: brgyALC, municipality: "Alfonso Castañeda" },
  { brgys: brgyAMB, municipality: "Ambaguio" },
  { brgys: brgyARI, municipality: "Aritao" },
  { brgys: brgyBAG, municipality: "Bagabag" },
  { brgys: brgyBAM, municipality: "Bambang" },
  { brgys: brgyBAY, municipality: "Bayombong" },
  { brgys: brgyDIA, municipality: "Diadi" },
  { brgys: brgyDDN, municipality: "Dupax del Norte" },
  { brgys: brgyDDS, municipality: "Dupax del Sur" },
  { brgys: brgyKAS, municipality: "Kasibu" },
  { brgys: brgyKAY, municipality: "Kayapa" },
  { brgys: brgyQUE, municipality: "Quezon" },
  { brgys: brgySTA, municipality: "Santa Fe" },
  { brgys: brgySOL, municipality: "Solano" },
  { brgys: brgyVIL, municipality: "Villaverde" },
];

export default function BarangayDropDown(props) {
  const [selectedBrgys, setselectedBrgys] = useState([]);

  useEffect(() => {
    if (props.municipality) {
      const brgy = brgyAll.find(
        (brgy) => brgy.municipality === props.municipality
      );
      setselectedBrgys(brgy.brgys);
    }

  }, [props.municipality]);

  return (
    <>
      <label className="block mb-2 font-medium">Barangay</label>
      <select
        name="barangay"
        value={props.barangay}
        onChange={props.onChange}
        className="border w-full p-2 rounded"
      >
        <option value="" disabled>
            {props.municipality ? `Select Barangay in ${props.municipality}` : "Select Municipality first"}
        </option>
        {selectedBrgys.map((brgy) => (
          <option key={brgy} value={brgy}>
            {brgy}
          </option>
        ))}
      </select>
    </>
  );
}
