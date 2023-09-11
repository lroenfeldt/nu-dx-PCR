import React from "react";
import Block from "../Block";
import Button from "../Button";
import { useLocation } from "react-router-dom";
import { ISettings, ITestProcedure } from "../../types/interfaces/settings";
import { IBarcode } from "../../types/interfaces/interfaces";
import { Graph, Text } from "..";
import { useTheme } from "../../assets/theme/ThemeContext";

interface ResultsFooterProps {
	activeBarcode: IBarcode;
	testmethod: ITestProcedure;
	settings: ISettings;
	barcodes: IBarcode[];
	locale?: string;
	navigate: (path: string) => void;
}

const ResultsFooter: React.FC<ResultsFooterProps> = ({ activeBarcode, testmethod, settings, barcodes, locale = "en", navigate }) => {
	const location = useLocation();
	const { colors } = useTheme();

	const currentBarcode = barcodes.find((barcode) => barcode.id === activeBarcode.id);
	const currentResult = currentBarcode?.result as string;
	const resultColor =
		currentResult === "invalid"
			? "orange"
			: testmethod.results.find((result) => result.name.includes(currentResult) || result.name === currentResult)?.color;

	const resultPrefix = currentResult === "positive" ? "+" : currentResult === "negative" ? "-" : "";
	const buttonText = `${resultPrefix} ${
		currentResult === "invalid"
			? "invalid"
			: testmethod.results.find((result) => result.name.includes(currentResult) || result.name === currentResult)?.["label" + locale.toUpperCase()] ||
			  currentResult
	}`;

	return (
		<Block inlineFlex gap={44} align="flex-end">
			<Block flex column gap={8}>
				<Text p>Barcode</Text>
				<Text label>{activeBarcode.value}</Text>
			</Block>
			<Block flex column gap={8}>
				<Text p>CT-N-Gene</Text>
				<Text label>
					{testmethod.parameters.map(
						(parameter) =>
							parameter.isPrimary &&
							parameter.showCT &&
							(activeBarcode.parameters?.[parameter.target]?.ct || activeBarcode.parameters?.[parameter.target.toLowerCase()]?.ct)
					)}
				</Text>
			</Block>
			<Block flex column gap={4} align="flex-start">
				<Text p>Ergebnis</Text>
				{testmethod.showResults && (
					<Block>
						<Button
							style={{
								padding: "12px 16px",
								height: "44px",
								borderRadius: "4px",
								minWidth: currentResult && currentResult.length > 9 ? 12 * currentResult.length : undefined,
								transition: ".3s",
								position: "relative",
								backgroundColor: resultColor,
								color: "#fff",
								borderWidth: 0,
								cursor: !settings.account.changeResults ? "auto" : "pointer",
							}}>
							{buttonText}
						</Button>
					</Block>
				)}
			</Block>
			{testmethod.showCurves && !location.pathname.includes("viewCurves") && (
				<Button
					onClick={() => navigate(`/viewCurves/${activeBarcode.id}`)}
					flex
					row
					height={64}
					center
					align="center"
					gap={8}
					bgColor={colors.secondary.main}>
					<Graph />
					<Text bold white>
						Graph
					</Text>
				</Button>
			)}
		</Block>
	);
};

export default ResultsFooter;
