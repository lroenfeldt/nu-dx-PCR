import { useData } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { ITestMethod } from "../../types/interfaces/interfaces";
import Card from "../Card";
import { useCallback } from "react";

interface TestmethodProps {
	title: string;
	status: string;
	methodid: string | number;
	image: string;
	openInfos: () => void;
}

const Testmethod: React.FC<TestmethodProps> = ({ title, status, methodid, image, openInfos }) => {
	const navigate = useNavigate();
	const { settings, setSelectedMethod } = useData();

	const selectTest = useCallback(() => {
		setSelectedMethod(methodid as string);
		if (settings.account.hasUserAuthentification || settings.account.askForLot) {
			navigate("/auth");
		} else {
			navigate("/enterBarcodes");
		}
	}, [methodid, navigate, setSelectedMethod, settings.account.askForLot, settings.account.hasUserAuthentification]);

	return (
		<Card
			title={title}
			subTitle={title}
			durationMinutes={settings.account.testprocedures.find((test: ITestMethod) => test.id == methodid)?.durationMinutes || 0}
			infos={""}
			onClick={selectTest}
			image={image}
			openInfos={() => {
				openInfos();
				setSelectedMethod(methodid as string);
			}}
		/>
	);
};

export default Testmethod;
