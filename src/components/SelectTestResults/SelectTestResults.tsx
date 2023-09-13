import React, { useCallback, useEffect } from "react";
import { useData, useTranslation } from "../../hooks";
import { VscChromeClose } from "react-icons/vsc";
import "./css/SelectTestResults.css";
import { ITestResult } from "../../types/interfaces/settings";
import { IBarcode } from "../../types/interfaces/interfaces";

interface Props {
	onSelect: () => void;
	onClose: () => void;
	isVisible?: boolean;
}

const SelectTestResults: React.FC<Props> = ({ onSelect, onClose, isVisible }) => {
	const { testid, barcodes, settings, setBarcodes, selectedMethod, selectedPosition, setSelectedPosition } = useData();

	const { t, locale } = useTranslation();
	const testmethod = settings.account.testprocedures.find((procedure) => procedure.id == selectedMethod);
	useEffect(() => {
		var modal = document.getElementById("modal");
		window.onclick = function (event) {
			if (event.target == modal && onClose != null) {
				onClose();
			}
		};
	}, []);
	const handleChooseResult = useCallback(
		async (result: ITestResult) => {
			onSelect();
			const barcode = barcodes.find((barcode) => barcode.posName == selectedPosition);
			if (barcode && barcode.result == result.name) return;

			const newResult = {
				[selectedPosition]: result.name,
			};
			setBarcodes((prev) => {
				return prev.map((barcode) => {
					if (barcode.posName == selectedPosition) {
						return {
							...barcode,
							result: result.name,
							alteredResult: true,
						};
					}
					return barcode;
				});
			});

			setSelectedPosition("");
			await window.api.editResults(testid, newResult);
		},
		[onSelect, selectedPosition, testmethod?.id]
	);
	const handleResetResult = useCallback(async () => {
		onSelect();
		const newResult = {
			[selectedPosition]: "",
		};
		setBarcodes((prev) => {
			return prev.map((barcode) => {
				if (barcode.posName == selectedPosition) {
					return {
						...barcode,
						result: barcode.oldResult != "" ? barcode.oldResult : "invalid",
						alteredResult: false,
					} as IBarcode;
				}
				return barcode;
			});
		});
		setSelectedPosition("");
		window.api.editResults(testid, newResult);
	}, [onSelect, selectedPosition, testmethod?.id]);

	return (
		<>
			<div id="modal" className={"overlay "} onClick={onClose}></div>
			<div className={`animate overlay-body  `}>
				<div className="overlay-header">
					<h2>{t("common.selectResult")}</h2>

					<div className="closebtn" onClick={onClose}>
						<VscChromeClose color="#fff" size={30} />
					</div>
				</div>
				<div className="overlay-content">
					{testmethod?.results.map((result, index) => {
						return (
							<button
								className={result.name}
								style={{
									color: "#fff",
									background: result.color,
									borderRadius: 15,
								}}
								key={result.id}
								onClick={() => handleChooseResult(result)}>
								{result["label" + locale?.toUpperCase()] || result.name.toUpperCase()}
							</button>
						);
					})}
					<button
						style={{
							color: "#fff",
							background: "orange",
							borderRadius: 15,
						}}
						onClick={() => handleChooseResult({ name: "invalid" } as ITestResult)}>
						Invalid
					</button>
					<button
						style={{
							color: "#fff",
							background: "grey",
							borderRadius: 15,
						}}
						onClick={() => handleResetResult()}>
						{t("common.resetResult")}
					</button>
				</div>
			</div>
		</>
	);
};
export default SelectTestResults;
