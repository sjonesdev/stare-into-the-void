import * as React from "react";
import ListCheckbox from "../../components/ListCheckbox";

import { SourceAPI } from "../../../stare-into-the-void-functions/src/models/image-assets";
import { ApiInfo, type ApiInfoValue } from "../../lib/apiInfo";

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

  return (
    <>
      {apiSelector}
      <div>Hello from Browse</div>
    </>
  );
}
