import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type Dimensions = { width: number; height: number };

const CanvasDimensionsContext = createContext<Dimensions>({ width: 300, height: 600 });

export const useCanvasDimensions = () => useContext(CanvasDimensionsContext);

export const CanvasDimensionsProvider = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 500, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        //console.log(containerRef.current.offsetWidth)
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <CanvasDimensionsContext.Provider value={dimensions}>
      <div ref={containerRef} className="w-full h-full">
        {children}
      </div>
    </CanvasDimensionsContext.Provider>
  );
};
