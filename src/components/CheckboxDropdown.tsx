"use client";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { createRef, useState } from "react";
import useCloseOnClickAway from "../hooks/useCloseOnClickAway";
import useOnMount from "../hooks/useOnMount";

interface CheckboxDropdownInput {
  value: string;
  /** Optional, value is used as label if not provided */
  label?: string;
  tooltip?: string;
  isDefault?: boolean;
}

type CheckboxDropdownProps = {
  dropdownText: string;
  values: CheckboxDropdownInput[];
  /**
   * The function the UI component should call whenever the
   * selected values are updated, passes in the newly selected
   * values as a string Set argument
   */
  setValues: (newValues: Set<string>) => void;
};

export default function CheckboxDropdown({
  dropdownText,
  values,
  setValues,
}: CheckboxDropdownProps) {
  const defaultSelected = new Set<string>();
  for (const val of values) {
    if (val.isDefault) defaultSelected.add(val.value);
  }
  const [selected, setSelected] = useState<Set<string>>(defaultSelected);
  const [open, setOpen] = useState<boolean>(false);
  const dropdown = createRef<HTMLDivElement>();

  useCloseOnClickAway(dropdown, () => setOpen(false));

  useOnMount(() => {
    setValues(selected);
  });

  const changeSelected = (value: string) => {
    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }
    const newSelected = new Set(selected);
    setSelected(newSelected);
    setValues(newSelected);
  };

  const getOpts = () => {
    const opts = [];
    for (const val of values) {
      const active = selected.has(val.value);
      opts.push(
        <li
          key={val.value}
          className={`relative cursor-pointer select-none py-2 pl-10 pr-4 truncate ease-in-out background-color duration-100 text-white ${
            active
              ? "font-medium hover:bg-gray-500"
              : "font-normal hover:bg-amber-600"
          }`}
          onClick={() => changeSelected(val.value)}
        >
          <label htmlFor={val.value} className="cursor-pointer">
            <input
              className="absolute opacity-0 w-0 h-0 cursor-pointer"
              type="checkbox"
              name={val.value}
              value={val.value}
              checked={active}
              onChange={() => changeSelected(val.value)}
            />
            {active ? (
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            ) : null}
            {val.label ?? val.value}
          </label>
        </li>
      );
    }
    return opts;
  };
  /* TODO - change to or wrap with fieldset */
  return (
    <div className="w-72" ref={dropdown}>
      <button
        className="h-10 z-30 max-h-min relative w-full rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm 3xl:text-lg"
        onClick={() => {
          setOpen(!open);
        }}
        type="button"
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
          "absolute z-20 mt-1 absolute mt-1 max-h-60 w-100 overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm 3xl:text-lg origin-top ease-in-out all transition duration-500 " +
          (open ? "" : " opacity-0 -translate-y-4 scale-y-0")
        }
      >
        {getOpts()}
      </ul>
    </div>
  );
}
