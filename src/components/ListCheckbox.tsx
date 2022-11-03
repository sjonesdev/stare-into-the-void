import { Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import "./ListCheckbox.css";

type ListCheckboxOption = {
  value?: string;
  tooltip?: string;
};

interface ListCheckboxInput extends ListCheckboxOption {
  isDefault?: boolean;
}

type ListCheckboxProps = {
  dropdownText: string;
  values: ListCheckboxInput[];
};

export default function ListCheckbox({
  dropdownText,
  values,
}: ListCheckboxProps) {
  const defSelected = new Set<string>();
  for (const idx in values) {
    if (values[idx].isDefault) defSelected.add(idx);
  }
  const [selected, setSelected] = React.useState<Set<string>>(defSelected);
  const [open, setOpen] = React.useState<boolean>(false);

  const changeSelected = (idx: string) => {
    if (selected.has(idx)) {
      selected.delete(idx);
    } else {
      selected.add(idx);
    }
    setSelected(new Set(selected));
  };

  const getOpts = () => {
    const opts = [];
    for (const idx in values) {
      const val = values[idx];
      const active = selected.has(idx);
      opts.push(
        <li
          key={idx}
          className={`relative cursor-pointer select-none py-2 pl-10 pr-4 truncate ease-in-out background-color duration-100 ${
            active
              ? "bg-amber-100 text-amber-900 font-medium hover:bg-yellow-300"
              : "text-gray-900 font-normal hover:bg-gray-300"
          }`}
          onClick={() => changeSelected(idx)}
        >
          <label htmlFor={val.value} className="cursor-pointer">
            <input
              className="absolute opacity-0 w-0 h-0 cursor-pointer"
              type="checkbox"
              name={val.value}
              value={idx}
              checked={active}
              onChange={() => changeSelected(idx)}
            />
            {active ? (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            ) : null}
            {val.value}
          </label>
        </li>
      );
    }
    return opts;
  };

  return (
    <div className="fixed top-16 w-72">
      <button
        className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span className="block truncate">{dropdownText}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </button>
      <ul
        className={
          "relative mt-1 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ease-in-out all transition duration-200 " +
          (open ? "" : "opacity-0 -translate-y-10 z-[-1]")
        }
      >
        {getOpts()}
      </ul>
    </div>
  );
}
