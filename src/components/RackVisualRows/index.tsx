import { useMemo } from "react";
import { useData } from "../../hooks";
import WellVisual from "../WellVisual";
import { IRackVisualRows, ITestMethod } from "../../types/interfaces/interfaces";
import Probe from "../Probe";
import useRackVisualRowsStyle from "./useRackVisualRowsStyle";
import { Block } from "..";
const RackVisualRows = (props: { active: number; markActive: (arg: number) => void; showResults: boolean; testmethod: ITestMethod | null }) => {
	const { active, markActive, showResults, testmethod } = props;
	const { isNinetySix, barcodes } = useData();
	let rackVisualRows: IRackVisualRows = [];
	const styles = useRackVisualRowsStyle();
	const length = isNinetySix ? 12 : 8;
	barcodes.forEach((barcode) => {
		let rowName = Math.ceil(barcode?.id / length) - 1;
		if (!rackVisualRows[rowName]) {
			rackVisualRows[rowName] = [];
		}
		rackVisualRows[rowName].push(
			<Probe
				key={barcode.id}
				barcode={barcode}
				isActive={barcode.id == active}
				onClick={() => markActive(barcode.id)}
				showResults={showResults}
				testmethod={testmethod?.id}
			/>
		);
	});

	const rackVisualization = useMemo(
		() =>
			rackVisualRows.map((row: number, index: number) => {
				return (
					<Block key={index} flex align="flex-start" gap="16px">
						{row}
					</Block>
				);
			}),
		[rackVisualRows, active]
	);

	return (
		<Block inlineFlex column align="flex-start" gap="16px">
			{rackVisualization}
		</Block>
	);
};

export default RackVisualRows;
