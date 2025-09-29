import { cn } from "@/lib/utils";
import DeleteTextIcon from "@/assets/icons/delete-text.svg?react";
import { useState } from "react";

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "←"],
];

type CustomKeyboardProps = {
  onKeyPress: (key: string) => void;
  className?: string;
};

export const CustomKeyboard = ({ onKeyPress, className }: CustomKeyboardProps) => {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const handleKeyClick = (key: string, index: number) => {
    setPressedIndex(index);
    onKeyPress(key);
    setTimeout(() => {
      setPressedIndex(null);
    }, 150); // match animation duration
  };

  return (
    <div
      className={cn(
        "z-999 fixed bottom-[84px] grid w-full grid-cols-3 rounded-md bg-white p-4",
        className
      )}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.preventDefault()}
    >
      {keys.flat().map((key, index) => (
        <button
          key={index}
          onClick={() => handleKeyClick(key, index)}
          className={cn(
            "rounded bg-white p-4 text-[28px] transition-transform duration-150 ease-out",
            pressedIndex === index && "scale-90"
          )}
        >
          {key === "←" ? (
            <div className="flex items-center justify-center">
              <DeleteTextIcon className="h-[24px] w-[24px]" />
            </div>
          ) : (
            key
          )}
        </button>
      ))}
    </div>
  );
};

export default CustomKeyboard;
