import { FC } from "react";

import { TailSpin } from "react-loader-spinner";
import { useData } from "../hooks";
import Checkmark from "./Checkmark";
import { IWellVisualProps } from "../types/components";

const WellVisual: FC<IWellVisualProps> = ({
  barcode,
  active,
  markActive,
  showResults = false,
  testmethod,
}) => {
  const { settings, isNinetySix } = useData();

  let result = "";
  if (showResults && testmethod) {
    if (testmethod.type && testmethod.type === "SNP") {
      result = barcode.result === "invalid" ? "-" : barcode.result;
    }

    if (testmethod.type && testmethod.type === "Absolute") {
      testmethod.parameters.map((parameter) => {
        if (parameter.isPrimary) {
          result = barcode.parameters?.[parameter.target]
            ? barcode.parameters?.[parameter.target]?.ct
            : barcode.parameters?.[parameter.target.toLowerCase()]?.ct;
        }
      });
    }

    return (
      <div
        key={barcode.id.toString()}
        className={`wellVisualization 
          ${isNinetySix ? "ninetySix" : ""}
          ${showResults ? "results" : ""}
            ${active === barcode.id ? "active" : ""} 
            ${barcode.checking ? "checking" : ""} 
            ${barcode.result == "" ? "blocked" : ""}
		        `}
        style={{
          backgroundColor:
            barcode.result != ""
              ? barcode.label == "NTC" || barcode.label == "TPC"
                ? undefined
                : barcode.result === "invalid"
                ? "orange"
                : testmethod.results.find((result) =>
                    result.name.includes(barcode.result)
                  )?.color
              : undefined,
        }}
        onClick={() => {
          markActive(barcode.id);
        }}
      >
        <div>
          {testmethod.controlSamples.map((sample, index) => {
            if (sample.label) {
              return <span key={index}>{sample.label}</span>;
            } else return <span key={index}>{barcode.label}</span>;
          })}
          <br />
          {testmethod.parameters.map((testparameter) => {
            if (
              barcode.parameters?.[testparameter.target.toUpperCase()] &&
              testparameter.isPrimary == true
            ) {
              return (
                <span
                  key={testparameter.target.toString()}
                  style={{
                    fontWeight: "normal",
                    fontSize: isNinetySix ? 12 : 16,
                    wordBreak: "break-word",
                  }}
                >
                  {result ? (result !== "0" ? result : "-") : "-"}
                </span>
              );
            }
          })}
        </div>
        <div key={barcode.label.toString()} className="spinnerContainer">
          <TailSpin height="70" width="70" color="white" />
        </div>
        <Checkmark
          testmethod={testmethod}
          barcode={barcode}
          isNinetySix={isNinetySix}
        />
      </div>
    );
  } else {
    return (
      <div
        key={barcode.id.toString()}
        className={`wellVisualization
            ${isNinetySix ? "ninetySix" : ""}
            ${active === barcode.id ? "active" : ""} 
            ${barcode.valid ? "valid" : ""} 
            ${barcode.checking ? "checking" : ""} 
            ${
              !barcode.checking && barcode.value.length >= 1 && !barcode.valid
                ? "invalid"
                : ""
            } 
            ${barcode.blocked ? "blocked" : ""}
            ${
              (barcode.value === "TPC" || barcode.value === "NTC") &&
              settings.account.autoControl
                ? "blocked"
                : ""
            } 
            ${barcode.result ? "res_" + barcode.result : ""}
        `}
        onClick={() => {
          markActive(barcode.id);
        }}
      >
        <span>{barcode.label}</span>
        <div className="spinnerContainer">
          {isNinetySix ? (
            <TailSpin height="40" width="40" color="white" />
          ) : (
            <TailSpin height="70" width="70" color="white" />
          )}
        </div>
      </div>
    );
  }
};

export default WellVisual;
