import * as React from "react";
import ListCheckbox from "../../components/ListCheckbox";

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

export default function Browse() {
  const [selectedAPIs, setSelectedAPIs] = React.useState();
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();

  const apiSelector = (
    <ListCheckbox dropdownText="Select Source APIs" values={apis} />
  );

  const dateRangeSelector = (
    <fieldset className="flex items-center mx-4">
      <label htmlFor="from">From</label>
      <input
        type="date"
        name="from"
        id="from-date"
        className="bg-gray-700 px-2 py-1 m-2"
        onChange={(e) => setFromDate(new Date(e.target.value))}
      />
      <label htmlFor="to">To</label>
      <input
        type="date"
        name="to"
        id="to-date"
        className="bg-gray-700 px-2 py-1 m-2"
        onChange={(e) => setToDate(new Date(e.target.value))}
      />
    </fieldset>
  );

  return (
    <>
      <form className="flex items-center bg-gray-800 text-gray-300">
        {apiSelector}
        {dateRangeSelector}
      </form>
      <div>Hello from Browse</div>
    </>
  );
}
