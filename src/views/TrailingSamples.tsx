import {
  Block,
  Keyboard,
  Controller,
  RackVisualRows,
  ActivateKeyboard,
} from "../components";
import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import urls from "../config/settings";
import { useNavigate } from "react-router-dom";
import { useData, useTranslation } from "../hooks";
import { IoMdCloseCircle } from "react-icons/io";
import { ITestProcedure } from "../types/interfaces/settings";
import { errorProps } from "../constants/errorProps";
import { IBarcode } from "../types/interfaces/interfaces";

const TrailingSamples = () => {
  const {
    reset,
    errors,
    barcodes,
    settings,
    toggleLid,
    setErrors,
    setLoading,
    offlineMode,
    setBarcodes,
    isNinetySix,
    selectedMethod,
  } = useData();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const textInput: React.RefObject<HTMLInputElement> = useRef(null);
  const [active, setActive] = useState(isNinetySix ? -11 : 0);
  const [barcodesValid, setBarcodesValid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const checkBarcodeUrl = settings.account.customCheckBarcodesEndpoint
    ? settings.account.customCheckBarcodesEndpoint
    : urls.checkBarcodeUrl;
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [barcodeCheckTimeout, setBarcodeCheckTimeout] = useState<any>( //@anicet ist nicht ganz sauber, bitte ienmal richtig machen
    null
  );
  const [clear, setClear] = useState(false);
  const [inputs, setInputs] = useState({});
  const [inputName, setInputName] = useState("default");
  const [trailing, setTrailing] = useState(false);
  const [controlsApplied, setControlsApplied] = useState(false);
  const testprocedure = settings.account.testprocedures.find(
    (testprocedure) => testprocedure.id === selectedMethod
  ) as ITestProcedure;

  const markActive = (id: number) => {
    setActive(id);
    if (textInput.current) textInput.current.focus();
  };




  //Move trailing samples to correct position
  useEffect(() => {
      setBarcodes((prevBarcodes) => { 
        let newBarcodes = prevBarcodes.map(({trailing, ...barcode}) => {

          //remove blocked trailing samples
          if (trailing) {
            return ({...barcode, blocked: false, valid: false})
          } else {
            return barcode
          }
        })

        console.log(newBarcodes)

        //manage trailing
        const trailingSamples = testprocedure.controlSamples.filter(control => control.position == 'trailing')
        const amountTrailing = trailingSamples.length
        let trailingSet = 0
        newBarcodes = newBarcodes.map(barcode => {
          if(trailingSet < amountTrailing && !barcode.blocked && !barcode.value){

              trailingSet += 1
              return {
                ...barcode,
                label: trailingSamples[trailingSet -1].label,
                value: trailingSamples[trailingSet -1].name,
                blocked: true,
                valid: true,
              }

          } else {
            return barcode
          }
        })
        return newBarcodes
      })
  }, [setBarcodes]);


  return (
    <>
      <div className={`BarcodeInput ${isNinetySix ? " ninetySix" : ""}`}>
        {!isNinetySix && <h3>{t("trailingSamples.instructions")}</h3>}
        <RackVisualRows
          active={active}
          markActive={markActive}
          showResults={false}
          testmethod={testprocedure}
        />
      </div>
      <div className="buttonArea">
        <button
          onClick={() => {
            isNinetySix && toggleLid();
            reset();
            navigate("/selectMethod");
          }}
        >
          {t("common.cancel")}
        </button>

        <button
          onClick={() => navigate("/testReady")}
          className={`${!barcodesValid ? "disabled" : ""}`}
        >
          {!trailing
            ? t("default.common.testStart")
            : t("default.common.continue")}
        </button>
      </div>
    </>
  );
};

export default TrailingSamples;
