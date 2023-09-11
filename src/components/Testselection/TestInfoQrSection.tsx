import React from "react";
import QRCode from "qrcode.react";
import { colors } from "../../assets/theme";
import Text from "../Text";
import QrCodeScan from "../Icons/QrCodeScan";
import IFU from "../Icons/IFU";

interface TestInfoQrSectionProps {
	styles: { [key: string]: React.CSSProperties };
}

const TestInfoQrSection: React.FC<TestInfoQrSectionProps> = ({ styles }) => (
	<div style={styles.testInfoContentRight}>
		<div style={styles.testInfoQrcodeScan}>
			<QrCodeScan />
			<div style={styles.testInfoIFU}>
				<Text p>IFU</Text> <IFU />
			</div>
		</div>
		<QRCode value="https://www.google.com" size={176} fgColor={colors.secondary.main} />
	</div>
);

export default TestInfoQrSection;
