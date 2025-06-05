import React from 'react';

type TipoRelacion = 'partner' | 'child' | 'sibling' | 'parent';

interface AddRelationButtonsProps {
  onAdd: (relacion: TipoRelacion) => void;
}

const AddRelationButtons: React.FC<AddRelationButtonsProps> = ({ onAdd }) => {
  return (
    <div className="flex flex-col space-y-2">
      <button onClick={() => onAdd('parent')} className=" rounded bg-blue-500 text-white">Add Parent</button>
      <button onClick={() => onAdd('partner')} className=" rounded bg-blue-500  text-white">Add Partner</button>
      <button onClick={() => onAdd('child')} className=" rounded bg-blue-500   text-white">Add Child</button>
      <button onClick={() => onAdd('sibling')} className=" rounded bg-blue-500   text-white">Add Sibling</button>
    </div>
  );
};

export default AddRelationButtons;
