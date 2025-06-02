import React, { useState } from 'react'
import AddNodeBtn from './AddNodeBtn'
import type { BaseProps } from '../../types/types';


type CanvasMenuProps = BaseProps & {
  onAddNode: () => void;
};

/*
interface CanvasMenuProps extends BaseProps {
  title?: string;
}
*/

export const CanvasMenu = ({ className,onAddNode  }: CanvasMenuProps) => {


  return (
    <div className={`${className}`}>
      <AddNodeBtn onClick={onAddNode}>Add person</AddNodeBtn>
    </div>
  )
}
