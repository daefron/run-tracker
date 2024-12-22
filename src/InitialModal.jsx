import { FakePage } from "./Components/FakePage";
export function InitialModal({ setDataSource, modalButtonClicked, error, setError }) {
  function clickButton(value) {
    setDataSource(value);
    setError(false);
    modalButtonClicked.current = true;
  }
  let errorText;
  if (error) {
    errorText = parseErrorText(error);
    function parseErrorText(error) {
      if (error === 401) {
        return "incorrect auth data";
      }
      if (error === 429) {
        return "hit API request limit";
      }
      return error;
    }
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
        {errorText ? (
          <p id="errorText" className="smallFont">
            ERROR: {errorText}
          </p>
        ) : (
          <></>
        )}
      </div>
      <FakePage />
    </div>
  );
}
