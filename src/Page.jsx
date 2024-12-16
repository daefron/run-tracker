import { Loaded } from "./Loaded";
import { Loading } from "./Components/Loading.jsx";
import { useEffect } from "react";
import "./App.css";
export function Page(props) {
  if (!props.loading) {
    return <Loaded runs={props.runs} />;
  } else {
    return <Loading />;
  }
}
