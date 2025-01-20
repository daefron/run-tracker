import { useState, useRef, useEffect } from "react";
import { apiFetch } from "./apiFetch.jsx";
import { Loaded } from "./Loaded";
import { Loading } from "./Components/Loading";
import "./App.css";
export default function Main() {
  const [runs, setRuns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const modalButtonClicked = useRef(false);
  useEffect(() => {
    apiFetch(setRuns, setLoading, setLastUpdated);
  }, [modalButtonClicked.current]);
  if (loading) {
    return <Loading />;
  } else {
    return <Loaded runs={runs} lastUpdated={lastUpdated} />;
  }
}
