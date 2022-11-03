import * as React from "react";
import ListCheckbox from "../../components/ListCheckbox";

import { ApiInfo } from "../../lib/apiInfo";

const apis: {
  value: string;
  displayText: string;
  tooltip: string;
  isDefault: boolean;
}[] = [];
for (const key in ApiInfo) {
  const apiVal = {
    value: key,
    displayText: ApiInfo[key].name,
    tooltip: ApiInfo[key].desc,
    isDefault: true,
  };
  apis.push(apiVal);
}

export default function Browse() {
  const apiSelector = (
    <ListCheckbox dropdownText="Select Source APIs" values={apis} />
  );

  const dateRangeSelector = (
    <fieldset>
      <label htmlFor="from">From</label>
      <input type="date" name="from" id="from-date" />
      <label htmlFor="to">To</label>
      <input type="date" name="to" id="to-date" />
    </fieldset>
  );

  return (
    <>
      {apiSelector}
      {dateRangeSelector}
      <div>Hello from Browse</div>
    </>
  );
}
