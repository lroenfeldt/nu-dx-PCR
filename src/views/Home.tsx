import { useEffect } from "react";
import { Testselection } from "../components";
import { useData } from "../hooks";

function Home() {
  const { setDeviceStatus } = useData();

  useEffect(() => {
    setDeviceStatus("IDLE");
  }, []);
  return <Testselection />;
}

export default Home;
