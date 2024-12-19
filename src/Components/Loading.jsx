import { PulseLoader } from "react-spinners";
import { FakePage } from "./FakePage.jsx";
export function Loading() {
  return (
    <div id="loadingHolder">
      <div id="loadingTextHolder">
        <p id="loadingText">Fetching Fitbit data</p>
        <PulseLoader id="loadingSymbol" size={5} color="white" />
      </div>
      <FakePage />
    </div>
  );
}
