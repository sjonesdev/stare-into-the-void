import { Listbox } from "@headlessui/react";
import * as React from "react";
import CheckboxDropdown from "../../components/CheckboxDropdown";
import DatePicker from "../../components/DatePicker";
import ImagePreview from "../../components/ImagePreview";
import SelectDropdown from "../../components/SelectDropdown";

import { ApiInfo } from "../../lib/apiInfo";

const apis: {
  value: string;
  tooltip: string;
  isDefault: boolean;
}[] = [];
for (const key in ApiInfo) {
  const apiVal = {
    value: ApiInfo[key].name,
    tooltip: ApiInfo[key].desc,
    isDefault: true,
  };
  apis.push(apiVal);
}

const sortOpts = ["Recent", "Relevant", "Something else idk"];

export default function Browse() {
  const [selectedAPIs, setSelectedAPIs] = React.useState<Set<string>>();
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();
  const [sortBy, setSortBy] = React.useState(sortOpts[0]);

  const apiSelector = (
    <CheckboxDropdown
      dropdownText="Select Source APIs"
      values={apis}
      setValues={setSelectedAPIs}
    />
  );

  const dateRangeSelector = (
    <fieldset className="flex items-center mx-4">
      <DatePicker labelText="From" inputName="from" setDate={setFromDate} />
      <DatePicker labelText="To" inputName="to" setDate={setToDate} />
    </fieldset>
  );

  const sortBySelector = (
    <SelectDropdown values={sortOpts} setValue={setSortBy} />
  );

  return (
    <>
      <div className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <form className="relative h-16 flex items-center text-gray-300">
            {apiSelector}
            {dateRangeSelector}
            {sortBySelector}
          </form>
        </div>
      </div>
      <div className="w-10/12 bg-charcoal bg-opacity-80 rounded-xl max-h-max min-h-full mx-auto my-12 ">
        <ImagePreview
          imgUrl="https://picsum.photos/500/500"
          dispText="Random Picture"
        />
      </div>
    </>
  );
}
