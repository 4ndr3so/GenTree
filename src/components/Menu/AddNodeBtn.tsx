import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  text?: string;
}

const AddNodeBtn: React.FC<ButtonProps> = ({ children, className, onClick }) => {
  return <button className={className} onClick={onClick}>{children}</button>;
};

export default AddNodeBtn;