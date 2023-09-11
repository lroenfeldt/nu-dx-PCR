import React from "react";
import useTestSelectionStyle from "./useTestSelectionStyle";
import { Button, Text } from ".."; // Remplacez par les chemins réels de vos composants
import Close from "../Close";
import TestInfoDetail from "./TestInfoDetail";
import TestInfoQrSection from "./TestInfoQrSection";
import { useTranslation } from "../../hooks";

import Cycles from "../Icons/Cycles";
import Wheel4 from "../Icons/Wheel4";
import Target from "../Icons/Target";
import Time from "../Icons/Time";

interface ITestInfoProps {
	onClose: () => void;
	selectTest?: () => void;
}
const TestInfos: React.FC<ITestInfoProps> = ({ onClose, selectTest }) => {
	const styles = useTestSelectionStyle();
	const { t } = useTranslation();

	return (
		<div style={styles.testInfo}>
			<div style={styles.closeBtn}>
				<Close onClick={onClose} />
			</div>
			<div style={styles.testInfoBody}>
				<div style={styles.testInfoTitle}>
					<Text h1>Covid-19</Text>
					<Text h3 style={styles.testInfoSubtitle}>
						nu-diagnostics
					</Text>
				</div>
				<Text p>
					loreLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa Cum sociis natoque penatibus et
					magnis dis parturient montes, nascetur ridiculus mus.
				</Text>
				<div style={styles.testInfoContent}>
					<div style={styles.testInfoContentLeft}>
						<TestInfoDetail Icon={Time} title="Duration" detail="60 Minutes" styles={styles} />
						<TestInfoDetail Icon={Cycles} title="Cycles" detail="4" styles={styles} />
						<TestInfoDetail Icon={Wheel4} title="Channels" detail="2" styles={styles} />
						<TestInfoDetail Icon={Target} title="Targets" detail="SARS-CoV-2" styles={styles} />
					</div>
					<TestInfoQrSection styles={styles} />
				</div>
			</div>
			<div style={styles.testInfoFooter}>
				<Button onClick={selectTest}>{t("common.toTest")}</Button>
			</div>
		</div>
	);
};

export default TestInfos;
