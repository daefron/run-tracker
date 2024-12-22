import { useState, useRef, useEffect } from "react";
import { apiFetch, testFetch } from "./apiFetch.jsx";
import { InitialModal } from "./InitialModal";
import { Loaded } from "./Loaded";
import { Loading } from "./Components/Loading";
import "./App.css";
export default function Main() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState();
  const [error, setError] = useState(false);
  const modalButtonClicked = useRef(false);
  useEffect(() => {
    if (dataSource === "test") {
      setTimeout(() => {
        console.log("Using test data");
        testFetch(setRuns, setLoading);
      }, 50);
    } else if (dataSource === "api") {
      apiFetch(setRuns, setLoading, setError);
    }
  }, [modalButtonClicked.current]);
  useEffect(() => {
    if (window.location.search) {
      console.log("Using api data");
      apiFetch(setRuns, setLoading, setError);
      setDataSource("api");
    }
  }, []);
  if (error) {
    return (
      <InitialModal
        setDataSource={setDataSource}
        modalButtonClicked={modalButtonClicked}
        setError={setError}
        error={error}
      />
    );
  }
  if (!dataSource) {
    return (
      <InitialModal
        setDataSource={setDataSource}
        setError={setError}
        modalButtonClicked={modalButtonClicked}
      />
    );
  }
  if (loading) {
    return <Loading />;
  } else {
    return <Loaded runs={runs} />;
  }
}
