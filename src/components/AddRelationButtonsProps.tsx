import React from 'react';

type TipoRelacion = 'padre' | 'pareja' | 'hijo' | 'hermano';

interface AddRelationButtonsProps {
  onAdd: (relacion: TipoRelacion) => void;
}

const AddRelationButtons: React.FC<AddRelationButtonsProps> = ({ onAdd }) => {
  return (
    <div className="flex gap-2 p-4">
      <button onClick={() => onAdd('padre')} className="px-4 py-2 rounded bg-blue-500 text-white">Add Parent</button>
      <button onClick={() => onAdd('pareja')} className="px-4 py-2 rounded bg-green-500 text-white">Add Partner</button>
      <button onClick={() => onAdd('hijo')} className="px-4 py-2 rounded bg-purple-500 text-white">Add Child</button>
      <button onClick={() => onAdd('hermano')} className="px-4 py-2 rounded bg-orange-500 text-white">Add Sibling</button>
    </div>
  );
};

export default AddRelationButtons;
