import { useState } from "react";

type Props = {
  onSubmit: (data: { name: string; age: number }) => void;
};

export default function PersonForm({ onSubmit }: Props) {
  const [name, setName] = useState("juan");
  const [age, setAge] = useState<number | "">(30);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es requerido.");
      return;
    }
    if (age === "" || isNaN(Number(age)) || Number(age) <= 0) {
      setError("La edad debe ser un número válido mayor que cero.");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), age: Number(age) });
    setName("");
    setAge("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md w-full max-w-sm">
      <h2 className="text-lg font-bold text-blue-800">Agregar Persona</h2>

      <div>
        <label className="block mb-1 text-sm font-medium text-blue-800">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm text-blue-800"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-blue-800">Edad</label>
        <input
          type="number"
          value={age}
          onChange={e => setAge(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full border px-3 py-2 rounded text-sm text-blue-800"
          min={1}
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
