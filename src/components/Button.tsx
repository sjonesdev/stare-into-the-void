import * as React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-lg font-bold bg-gray-700 px-4 py-2 rounded-xl min-w-max w-32 hover:scale-x-110 hover:scale-y-110"
    >
      {text}
    </button>
  );
}
