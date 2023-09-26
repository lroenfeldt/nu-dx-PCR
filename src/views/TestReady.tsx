import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Oval } from "react-loader-spinner";
import { RiAlertFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useData, useTranslation } from "../hooks";
import { IBarcode, IError } from "../types/interfaces/interfaces";
import { ITestProcedure } from "../types/interfaces/settings";
import { Alert, Block, Button, Text } from "../components";

const TestReady: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string | null>(null);

	const navigate = useNavigate();
	const { t } = useTranslation();
	const { demo, testid, errors, barcodes, settings, setTestid, setErrors, setDeviceStatus, isNinetySix, selectedMethod } = useData();

	useEffect(() => {
		setTestid(settings.isDev ? "demo" : uuidv4());
	}, [settings, setTestid]);

	const generateWellsSetup = (barcodes: IBarcode[], testMethod: ITestProcedure): string => {
		return barcodes
			.filter((barcode) => barcode.value.length >= 1)
			.map(
				(barcode) => `
        <Well Name="${barcode.posName}" SampleId="${barcode.value}">
          <Tasks>
            ${testMethod.parameters.map((_, i) => `<Task DetectorId="${i + 1}" Type="Unknown" />`).join("")}
          </Tasks>
        </Well>
      `
			)
			.join("\n");
	};

	const setupToBackend = useCallback(() => {
		setLoading(true);
		setErrors((prevErrors: IError[]) => prevErrors.filter((error) => error.type !== "startTest"));
		setMessage(t("testReady.startTest"));

		const testMethod = settings.account.testprocedures.find((procedure) => procedure.id === selectedMethod) as ITestProcedure;

		const wellsSetup = generateWellsSetup(barcodes, testMethod);
		let xml_output = testMethod?.protocol ? testMethod.protocol.replace("%%testname%%", testid).replace("%%wells%%", wellsSetup) : "";

		if (isNinetySix) {
			xml_output = xml_output.replace("cy5", "Cy5");
		}

		const testStarted = window.api.startLineGene(testid, xml_output, settings, barcodes, selectedMethod);
		if (!testStarted) {
			setErrors((prevErrors: IError[]) => [...prevErrors, { type: "startTest", message: t("errors.failedToStartTest") }]);
			setDeviceStatus("IDLE");
		} else {
			navigate("/testRunning");
			setDeviceStatus("RUNNING");
		}
	}, [testid]);

	const startTest = useCallback(() => {
		if (demo) {
			navigate("/testRunning");
			setDeviceStatus("RUNNING");
		} else {
			setupToBackend();
		}
	}, []);

	if (loading) {
		return (
			<div className="TestReady">
				<div className="spinnerContainer">
					<Oval height="100" width="100" color="var(--primary)" />
				</div>
				<h3>{message}</h3>
			</div>
		);
	} else {
		return (
			<Block flex center height={"100%"} width="100%">
				<Block flex column center gap={50}>
					<Block flex justify="space-around" gap={10} align="center">
						<Alert />
						<Text h3>{isNinetySix ? t("testReady.ninetySixsInstructions") : t("testReady.instructions")}</Text>
					</Block>
					<Block flex justify="space-around">
						<Button
							outlined
							onClick={() => {
								navigate("/enterBarcodes");
								setDeviceStatus("IDLE");
							}}>
							{t("testReady.noGoBack")}
						</Button>
						<Button onClick={startTest}>{t("testReady.yesStartTest")}</Button>
					</Block>
				</Block>
			</Block>
		);
	}
};

export default TestReady;
