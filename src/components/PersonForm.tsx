import { useEffect, useState } from "react";

import type { PersonGedCom } from "../types/types";
import { useSelector } from "react-redux";
import {type RootState } from "../store";

type Props = {
  onSubmit: (data: PersonGedCom) => void;
  person: PersonGedCom
};

export default function PersonForm({ onSubmit ,person}: Props) {

  //console.log("PersonForm", "person:", person);

  const [firstName, setFirstName] = useState(person?.firstName || "");
  const [lastName, setLastName] = useState(person?.lastName || "");
  const [birthDate, setBirthDate] = useState(person?.birthDate || "");
  const [gender, setGender] = useState(person?.gender || "U");
  const [error, setError] = useState("");

  //console.log("PersonForm", "firstName:", firstName, "lastName:", lastName, "birthDate:", birthDate, "gender:", gender);
//actualiza cuando cambia el person
  useEffect(() => {
    setFirstName(person?.firstName || "");
    setLastName(person?.lastName || "");
    setBirthDate(person?.birthDate || "");
    setGender(person?.gender || "U");
  }, [person]);

  const handleSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!firstName.trim()) {
      setError("El nombre es requerido.");
      return;
    }
    if (birthDate === "" || isNaN(Number(birthDate)) || Number(birthDate) <= 0) {
      setError("La fecha de nacimiento debe ser un número válido mayor que cero.");
      return;
    }
    setError("");
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), birthDate: birthDate.trim(), gender });
    setFirstName("");
    setLastName("");
    setBirthDate("");
    setGender("U");
  };

  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md w-full max-w-sm">
      <h2 className="text-lg font-bold text-blue-800">Add Person</h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-blue-800">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm text-blue-800"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-blue-800">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm text-blue-800"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-blue-800">BirthDate</label>
        <input
          type="text"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value || "")}
          className="w-full border px-3 py-2 rounded text-sm text-blue-800"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-indigo-600 text-blue-800 px-4 py-2 rounded hover:bg-indigo-700 text-sm"
      >
        Agregar
      </button>
    </form>
  );
}
