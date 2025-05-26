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