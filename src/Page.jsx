import { Loaded } from "./Loaded";
import { Loading } from "./Components/Loading.jsx";
import "./App.css";
export function Page({ loading, runs }) {
  if (!loading) {
    return <Loaded runs={runs} />;
  } else {
    return <Loading />;
  }
}
