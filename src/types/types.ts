// src/types/index.ts or src/shared/types.ts
export interface BaseProps {
  className?: string;
}
export interface CircleData {
      x: number;
      y: number;
      radius: number;
      fill: string;
      id: string;
      draggable: boolean;
    }

export interface TreeNode {
  id: string;
  parentId: string | null;
  x: number;
  y: number;
  label: string;
}

export interface PersonNode {
  id: string;
  name: string;
  x: number;
  y: number;
  connection?: string; // Optional connection to another node
  children?: PersonNode[]; // Optional children nodes
}