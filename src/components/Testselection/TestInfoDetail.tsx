import React from "react";
import Text from "../Text";

interface TestInfoDetailProps {
	Icon: React.ComponentType;
	title: string;
	detail: string;
	styles: { [key: string]: React.CSSProperties };
}

const TestInfoDetail: React.FC<TestInfoDetailProps> = ({ Icon, title, detail, styles }) => (
	<div style={styles.testInfoDetails}>
		<div style={styles.testInfoDetailsLeft}>
			<Icon /> <Text p>{title}</Text>
		</div>
		<Text p>{detail}</Text>
	</div>
);

export default TestInfoDetail;
