import Line from "../components/Charts/Line";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation, useData } from "../hooks";
import { Block, Button, ButtonArea, ResultsFooter } from "../components";

function ViewCurves() {
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();
	const { barcodes, selectedMethod, settings, handleOpenEdit } = useData();

	const barcode = id ? barcodes.find((barcode) => barcode.id === parseInt(id)) : null;
	const testmethod = settings.account.testprocedures.find((procedure) => procedure.id === selectedMethod);
	return (
		<Block flex center column align="center" width={"100%"} height={"100%"}>
			<Block center>
				<Block width={"150vh"} height={"45vh"} padding={40} margin={40} white>
					{barcode && <Line barcode={barcode} />}
				</Block>
			</Block>

			{barcode && testmethod && (
				<ResultsFooter locale="en" settings={settings} barcodes={barcodes} navigate={navigate} activeBarcode={barcode} testmethod={testmethod} />
			)}
		</Block>
	);
}

export default ViewCurves;
