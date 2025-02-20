import React, { useCallback, useEffect, useState, useRef } from "react";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  initialMin?: number;
  initialMax?: number;
  onChange: ({ min, max }: { min: number; max: number }) => void;
}

export const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  min,
  max,
  initialMin = min,
  initialMax = max,
  onChange,
}) => {
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  const handleMinChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(event.target.value), maxVal - 1);
      setMinVal(value);
      minValRef.current = value;
      onChange({ min: value, max: maxVal });
    },
    [maxVal, onChange]
  );

  const handleMaxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(event.target.value), minVal + 1);
      setMaxVal(value);
      maxValRef.current = value;
      onChange({ min: minVal, max: value });
    },
    [minVal, onChange]
  );

  return (
    <div className="relative h-7">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={handleMinChange}
        className="thumb thumb--left absolute h-0 w-full outline-none pointer-events-none"
        style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={handleMaxChange}
        className="thumb thumb--right absolute h-0 w-full outline-none pointer-events-none"
      />

      <div className="slider relative w-full">
        <div className="slider__track absolute w-full h-1 bg-gray-200 rounded" />
        <div 
          ref={range} 
          className="slider__range absolute h-1 bg-indigo-600 rounded"
        />
      </div>
    </div>
  );
}; 