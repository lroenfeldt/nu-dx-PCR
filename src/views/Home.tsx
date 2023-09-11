import { useEffect } from "react";
import { Block, Testselection } from "../components";
import { useData, useTranslation } from "../hooks";
import { Text } from "../components";

function Home() {
	const { setDeviceStatus } = useData();
	const { t } = useTranslation();
	useEffect(() => {
		setDeviceStatus("IDLE");
	}, []);
	return <Testselection />;
}

export default Home;
