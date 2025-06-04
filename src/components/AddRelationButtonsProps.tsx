import React from 'react';

type TipoRelacion = 'padre' | 'pareja' | 'hijo' | 'hermano';

interface AddRelationButtonsProps {
  onAdd: (relacion: TipoRelacion) => void;
}

const AddRelationButtons: React.FC<AddRelationButtonsProps> = ({ onAdd }) => {
  return (
    <div className="flex flex-col space-y-2">
      <button onClick={() => onAdd('padre')} className=" rounded bg-blue-500 text-white">Add Parent</button>
      <button onClick={() => onAdd('pareja')} className=" rounded bg-blue-500  text-white">Add Partner</button>
      <button onClick={() => onAdd('hijo')} className=" rounded bg-blue-500   text-white">Add Child</button>
      <button onClick={() => onAdd('hermano')} className=" rounded bg-blue-500   text-white">Add Sibling</button>
    </div>
  );
};

export default AddRelationButtons;
