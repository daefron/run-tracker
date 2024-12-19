import { FakePage } from "./Components/FakePage";
export function InitialModal({ setDataSource, modalButtonClicked }) {
  function clickButton(value) {
    setDataSource(value);
    modalButtonClicked.current = true;
  }
  return (
    <div id="initialModalHolder">
      <div id="initialModal">
        <p className="titleFont">Welcome to my unnamed run tracker</p>
        <p className="smallFont">
          Please choose between either live or testing data:
        </p>
        <div id="modalButtonHolder">
          <button
            onClick={() => clickButton("api")}
            className="modalButton titleFont"
          >
            Live
          </button>
          <button
            onClick={() => clickButton("test")}
            className="modalButton titleFont"
          >
            Test
          </button>
        </div>
        <p className="smallFont">
          (do note, live data requires signing into a personal Fitbit account)
        </p>
      </div>
      <FakePage />
    </div>
  );
}
