import { useEffect } from "react";
import { Testselection } from "../components";
import { useData, useTranslation } from "../hooks";

function Home() {
  const { setDeviceStatus } = useData();
  const { t } = useTranslation();
  useEffect(() => {
    setDeviceStatus("IDLE");
  }, []);
  return <Testselection />;
}

export default Home;
