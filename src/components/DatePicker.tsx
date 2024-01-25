"use client";

export default function DatePicker({
  labelText,
  inputName,
  setDate,
}: {
  labelText: string;
  inputName: string;
  setDate: (d: Date) => void;
}) {
  return (
    <>
      <label htmlFor={inputName}>{labelText}</label>
      <input
        type="date"
        name={inputName}
        id={inputName}
        className="scheme-dark h-10 bg-gray-700 px-3 py-2 mx-2 sm:text-sm 3xl:text-lg rounded-md text-white"
        onChange={(e) => setDate(new Date(e.target.value))}
      />
    </>
  );
}
