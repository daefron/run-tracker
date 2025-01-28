import { useState, useRef, useEffect } from "react";
import { apiFetch } from "./apiFetch.jsx";
import { Loaded } from "./Loaded";
import { Loading } from "./Components/Loading";
import "./App.css";
export default function Main() {
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    apiFetch(setData, setLoading);
  },[]);
  if (loading) {
    return <Loading />;
  } else {
    return (
      <Loaded
        data={data}
        setLoading={setLoading}
        setLastUpdated={setLastUpdated}
      />
    );
  }
}
