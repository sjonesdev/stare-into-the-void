import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface SelectDropdownProps {
  values: string[];
  defaultValue?: string;
  /**
   * The function the UI component should call whenever the
   * selected value is updated, passes in the newly selected
   * value as an argument
   */
  setValue: (newValue: string) => void;
}

const people = [
  { name: "Wade Cooper" },
  { name: "Arlene Mccoy" },
  { name: "Devon Webb" },
  { name: "Tom Cook" },
  { name: "Tanya Fox" },
  { name: "Hellen Schmidt" },
];

export default function SelectDropdown({
  values,
  defaultValue,
  setValue,
}: SelectDropdownProps) {
  const initVal = defaultValue ?? values[0];
  const [selected, setSelected] = useState(initVal);
  const setSelectedAndValue = (newVal: string) => {
    setSelected(newVal);
    setValue(newVal);
  };

  return (
    <div className="w-72">
      <Listbox value={selected} onChange={setSelectedAndValue}>
        <div className="relative">
          <Listbox.Button className="relative h-10 w-full cursor-default rounded-lg bg-gray-700 py-2 pl-3 pr-10 text-left text-white shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in-out duration-100"
            leaveFrom="opacity-100 translateY(0)"
            leaveTo="opacity-0 translateY(0)"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {values.map((val, idx) => (
                <Listbox.Option
                  key={idx}
                  className={`relative cursor-default select-none py-2 pl-10 pr-4 text-white transition background-color ease-in-out duration-100 ${
                    selected === val
                      ? "hover:bg-gray-500"
                      : "hover:bg-amber-600"
                  }`}
                  value={val}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {val}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
