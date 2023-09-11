import { useData } from "../hooks";
import WellVisual from "./WellVisual";
import { IBarcode, IRackVisualRows, IWellVisual } from "../types/interfaces/interfaces";

const RackVisualization = ({ markActive, active, testmethod }: IWellVisual) => {
	const { barcodes } = useData();

	//Create RackVisualization
	let rackVisualRows: IRackVisualRows = [];
	barcodes.map((barcode: IBarcode) => {
		let rowName = Math.ceil(barcode.id / 8) - 1;
		console.log(rowName);
		if (!rackVisualRows[rowName]) {
			rackVisualRows[rowName] = [];
		}
		rackVisualRows[rowName].push(
			<WellVisual key={barcode.id.toString()} barcode={barcode} active={active} markActive={markActive} showResults={true} testmethod={testmethod} />
		);
	});

	return (
		<div className="rackVisualization ">
			{rackVisualRows.map((row: number, index: number) => (
				<div key={index} className={"rackRow"}>
					{row}
				</div>
			))}
		</div>
	);
};

export default RackVisualization;
