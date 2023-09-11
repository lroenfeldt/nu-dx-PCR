import React, { useEffect } from "react";
//import { FiUpload, FiRefreshCw, FiUploadCloud, FiSave, FiExternalLink } from "react-icons/fi"

import { Block, Button, Text, Toggle } from "../components";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { BsCloudCheckFill } from "react-icons/bs";
import { PiWarningCircleFill } from "react-icons/pi";
import { useData, useTranslation } from "../hooks";
import { AiFillUsb } from "react-icons/ai";
import { FaMicroscope, FaCloudUploadAlt, FaCheck } from "react-icons/fa";
import { useResults, useSticky } from "../hooks";
import urls from "../config/settings";

const ResultList: React.FC = () => {
	const navigate = useNavigate();
	const {
		results,
		reading,
		settings,
		setTestid,
		USBPresent,
		submitting,
		offlineMode,
		setTestDone,
		submitFilter,
		resetBarcodes,
		setSubmitFilter,
		failedSubmittingResults,
	} = useData();
	const { checkUSB, saveToUSB, submitAll, getResults, submitResult, saveAllToUSB } = useResults();
	const { t, locale } = useTranslation();

	const handleSubmitToggleChange = () => {
		getResults(!submitFilter);
		setSubmitFilter(!submitFilter);
	};

	const viewResult = (testid: string, done: boolean) => {
		resetBarcodes();
		setTestid(testid);
		setTestDone(done);
		navigate("/ViewResults");
	};

	//Create Table

	let tableRows: JSX.Element[] = [];

	results
		.sort((a, b) => new Date(b.testStarted).getTime() - new Date(a.testStarted).getTime())
		.forEach((result, index) => {
			let buttonUSB;
			let buttonSubmit;
			let buttonView;

			//button for db submit
			if (result.isSubmitting) {
				buttonSubmit = (
					<div className="button" onClick={() => submitResult(result.testid, result.submitted)}>
						<div className="spinnerContainer">
							<Oval height="30" width="30" color="white" />
						</div>
					</div>
				);
			} else if (!result.isSubmitting) {
				buttonSubmit = (
					<Button rounded className="button" onClick={() => submitResult(result.testid, result.submitted)}>
						<FaCheck />
					</Button>
				);
			} else if (offlineMode) {
				buttonSubmit = (
					<div className="button disabled">
						<FaCloudUploadAlt />
					</div>
				);
			} else if (!settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)) {
				buttonSubmit = (
					<Button rounded className="button disabled">
						<FaCloudUploadAlt />
					</Button>
				);
			} else {
				buttonSubmit = (
					<div className="button" onClick={() => submitResult(result.testid, result.submitted)}>
						<FaCloudUploadAlt />
					</div>
				);
			}

			let cloudBadge;
			if (result.submitted) {
				cloudBadge = (
					<div className="cloudBadge">
						<BsCloudCheckFill />
					</div>
				);
			}
			if (failedSubmittingResults.includes(result.testid) || result.isSubmitting == false) {
				cloudBadge = (
					<div className="cloudBadge error">
						<PiWarningCircleFill />
					</div>
				);
			}

			if (settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)?.showResults) {
				//button for usb export
				if (result.isWriting) {
					buttonUSB = (
						<div className="button" onClick={() => saveToUSB(result.testid, result.submitted)}>
							<Button className="spinnerContainer">
								<Oval height="30" width="30" color="white" />
							</Button>
						</div>
					);
				} else if (result.writingSuccess) {
					buttonUSB = (
						<Button className="button" onClick={() => saveToUSB(result.testid, result.submitted)}>
							<FaCheck />
						</Button>
					);
				} else if (!USBPresent) {
					buttonUSB = (
						<Button className="button disabled">
							<AiFillUsb />
						</Button>
					);
				} else if (
					!settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod) ||
					settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)?.showResults == false
				) {
					buttonUSB = (
						<Button rounded className="button disabled">
							<AiFillUsb />
						</Button>
					);
				} else {
					buttonUSB = (
						<Button rounded className="button" onClick={() => saveToUSB(result.testid, result.submitted)}>
							<AiFillUsb />
						</Button>
					);
				}

				//button for view
				if (
					!settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod) ||
					settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)?.showResults == false
				) {
					buttonView = (
						<Button rounded>
							<FaMicroscope />
						</Button>
					);
				} else {
					buttonView = (
						<Button rounded className="button" onClick={() => viewResult(result.testid, result.submitted)}>
							<FaMicroscope />
						</Button>
					);
				}
			}
			let submittingFailed;
			if (failedSubmittingResults.includes(result.testid)) {
				submittingFailed = (
					<Button rounded className="button error">
						<PiWarningCircleFill size={30} />
					</Button>
				);
			}

			//Testmethod name
			let testMethodName: string = "unsupported";
			if (!result.testmethod) {
				result.testmethod = urls.TESTMETHOD; //Covid backwards compatability
			}
			if (settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod)) {
				const foundTestMethod = settings.account.testprocedures.find((testmethod) => testmethod.id === result.testmethod);
				const localLabel = "label" + locale?.toUpperCase();
				testMethodName =
					foundTestMethod && localLabel in foundTestMethod ? (foundTestMethod as any)[localLabel] ?? foundTestMethod.name : "unsupported";
			}

			tableRows.push(
				<Block key={`${result.testid}-${index}`} flex card padding={20} marginBottom={10}>
					<Block className="testinfo">
						<Text h4>{result.testid}</Text>
						<Text>{testMethodName}</Text>
						<Text small>
							{t("common.started")}: {result.testStarted.toLocaleString()}
						</Text>
						<Text small>
							{t("common.ended")}: {result.testFinished.toLocaleString()}
						</Text>
					</Block>
					<Block flex gap={16} align="center" justify="flex-end">
						{submittingFailed}
						{buttonView}
						{buttonSubmit}
						{buttonUSB}
						{cloudBadge}
					</Block>
				</Block>
			);
		});

	useEffect(() => {
		resetBarcodes();
		getResults(submitFilter);
	}, []);

	//Check if USB is Present
	useEffect(() => {
		checkUSB();
		const clearcheckUSB = setInterval(() => checkUSB(), 3000);
		return () => clearInterval(clearcheckUSB);
	}, []);
	useSticky({ top: 70, id: "stickyHeader", stickyClass: "ResultList" });
	return (
		<Block className="ResultList">
			<Block id="stickyHeader" className="titleArea">
				<Text>{t("resultList.title")}</Text>
				{(submitting || reading) && (
					<div className="spinnerContainer">
						<Oval height="50" width="50" color="var(--primary)" />
					</div>
				)}
				<label>
					<span>{t("resultList.onlyPending")}</span>
					<Toggle isOn={submitFilter} handleToggle={() => handleSubmitToggleChange()} />
				</label>
			</Block>
			{tableRows}
			<Block flex>
				<Button
					onClick={() => {
						navigate("/selectMethod");
					}}>
					{t("common.back")}
				</Button>
				{submitFilter ? <button onClick={() => submitAll()}>{t("resultList.submitAll")}</button> : ""}
				<Button className={!USBPresent ? "disabled" : ""} onClick={() => saveAllToUSB()}>
					{t("resultList.exportAll")}
				</Button>
			</Block>
		</Block>
	);
};

export default ResultList;
