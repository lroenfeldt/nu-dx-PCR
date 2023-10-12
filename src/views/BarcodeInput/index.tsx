import { Block, RackVisualRows } from "../../components";
import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import urls from "../../config/settings";
import { useData, useTranslation } from "../../hooks";
import useNextWell from "./hooks/useNextWell";
import { IBarcode } from "../../types/interfaces/interfaces";
import HeaderSection from "./components/HeaderSection";
import InputSection from "./components/InputSection";
import ActionsSection from "./components/ActionsSection";
import BarcodeKeyboard from "./components/BarcodeKeyboard";

import { useBarcodeProperties, useDatabaseCheck } from "./hooks";
const BarcodeInput = () => {
  const {
    errors,
    barcodes,
    settings,
    toggleLid,
    setLoading,
    offlineMode,
    setBarcodes,
    isNinetySix,
  } = useData();

  const { t } = useTranslation();
  const textInput: React.RefObject<HTMLInputElement> = useRef(null);
  const [active, setActive] = useState<number>(isNinetySix ? -11 : 0);
  const [barcodesValid, setBarcodesValid] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const checkBarcodeUrl = settings.account.customCheckBarcodesEndpoint
    ? settings.account.customCheckBarcodesEndpoint
    : urls.checkBarcodeUrl;
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [barcodeCheckTimeout, setBarcodeCheckTimeout] = useState<number | null>(
    null
  );
  const { checkBarcodeValidity, checkControlPlaceholders } =
    useBarcodeProperties();
  const { checkAgainstDb, useCancelToken } = useDatabaseCheck();
  const [clear, setClear] = useState(false);
  const [inputs, setInputs] = useState({});
  const [inputName, setInputName] = useState("default");

  const markActive = (id: number) => {
    setActive(id);
    if (textInput.current) textInput.current.focus();
  };

  useEffect(() => {
    setInputName(getBarcode(active)?.label);
  }, [active]);

  const checkBarcode = useCallback(
    async (id: number) => {
      let newBarcode = getBarcode(id) as IBarcode;

      if (!settings.account.verifyBarcodes) {
        newBarcode = { ...newBarcode, checking: false, valid: true };
        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((prevBarcode) =>
            newBarcode.id === prevBarcode.id
              ? { ...prevBarcode, checking: false, valid: true }
              : prevBarcode
          )
        );
        return;
      }

      const checkedControl = checkControlPlaceholders(newBarcode);
      if (checkedControl) {
        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((prevBarcode) =>
            newBarcode.id === prevBarcode.id
              ? { ...prevBarcode, ...checkedControl }
              : prevBarcode
          )
        );
        return;
      }

      const { isValid, validationErr } = checkBarcodeValidity(
        newBarcode,
        settings
      );

      if (
        isValid &&
        newBarcode.value.indexOf("-R") === -1 &&
        settings.account.checkBarcodesDB
      ) {
        const cancelTokenHook = useCancelToken();
        const token = cancelTokenHook.create();
        const dbResult = await checkAgainstDb(newBarcode, settings, token);
        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((prevBarcode) =>
            newBarcode.id === prevBarcode.id
              ? {
                  ...prevBarcode,
                  checking: false,
                  valid: dbResult.isValid,
                  error: dbResult.validationErr as string,
                  askRetest: dbResult.askRetest,
                }
              : prevBarcode
          )
        );
      } else {
        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((prevBarcode) =>
            newBarcode.id === prevBarcode.id
              ? {
                  ...prevBarcode,
                  checking: false,
                  valid: isValid,
                  error: validationErr as string,
                }
              : prevBarcode
          )
        );
      }
    },
    [barcodes, offlineMode, settings, checkBarcodeValidity]
  );
  const updateBarcode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      onKeyPress(value);
    },
    [active, inputName, barcodes, barcodeCheckTimeout]
  );

  const onKeyPress = useCallback(
    (value: string) => {
      if (barcodeCheckTimeout) clearTimeout(barcodeCheckTimeout);
      setInputs((prevInputs) => ({ ...prevInputs, [inputName]: value }));

      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) => ({ ...barcode, checking: false }))
      );
      let newBarcode = getBarcode(active);
      newBarcode = {
        ...newBarcode,
        value: value,
        checking: true,
        valid: false,
        error: "",
      };
      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) =>
          barcode.id === active ? newBarcode : barcode
        )
      );

      setBarcodeCheckTimeout((prevTimeout) => {
        if (prevTimeout) {
          clearTimeout(prevTimeout);
        }

        const timeoutId = setTimeout(() => {
          checkBarcode(active);
          setBarcodeCheckTimeout(null);
        }, 500);

        return timeoutId as unknown as number;
      });
    },
    [active, barcodes, barcodeCheckTimeout, checkBarcode]
  );

  const checkAll = useCallback(
    async (barcodes: IBarcode[]) => {
      for (let i = 0; i < barcodes.length; i++) {
        await checkBarcode(barcodes[i].id);
      }
    },
    [offlineMode]
  );

  const retest = async (barcode: IBarcode) => {
    setLoading(true);
    setBarcodes((prevBarcodes) =>
      prevBarcodes.map((prevBarcode) =>
        barcode.id === prevBarcode.id
          ? {
              ...barcode,
              checking: true,
            }
          : prevBarcode
      )
    );

    let retestNumber = 0;
    let newBarcodeValue: string = "";
    let newErrors = errors.filter((error) => error.type !== "dbCon");

    let hit = true;
    let dbError = false;

    while (hit === true && dbError === false) {
      retestNumber++;
      newBarcodeValue = barcode.value + "-R" + retestNumber;
      setInputs({
        ...inputs,
        [inputName]: newBarcodeValue,
      });
      try {
        let response = await axios.get(`${checkBarcodeUrl}/${newBarcodeValue}`);
        let result = response.data;
        if (result === null) {
          hit = false;
        }
        setLoading(false);
      } catch (err: any) {
        setLoading(true);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          window.api.logEvents(
            `status: ${err.response.status} headers: ${
              err.response.headers
            } data: ${JSON.stringify(err.response.data)}`
          );
          dbError = true;
          newErrors.push({
            type: "dbCon",
            message: t("errors.checkTestSampleFail"),
          });
        } else if (err.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(err.request);
          window.api.logEvents(`request: ${JSON.stringify(err.request)}`);
          dbError = true;
          newErrors.push({
            type: "dbCon",
            message: t("errors.dbConnectionError"),
          });
        } else {
          // Something happened in setting up the request that triggered an Error

          console.log("Error", err.message);
          window.api.logEvents(`Error: ${err.message}`);
          dbError = true;
          newErrors.push({
            type: "dbCon",
            message: t("errors.dbConnectionError"),
          });
        }
      }
    }

    let newBarcode = {
      ...barcode,
      value: newBarcodeValue,
      valid: true,
      checking: false,
      error: t("errors.testSample"),
      askRetest: false,
    };

    setBarcodes((prevBarcodes) =>
      prevBarcodes.map((prevBarcode) =>
        newBarcode.id === prevBarcode.id
          ? {
              ...prevBarcode,
              value: newBarcodeValue,
              valid: true,
              checking: false,
              error: t("errors.testSample"),
              askRetest: false,
            }
          : prevBarcode
      )
    );
  };

  const { nextWell } = useNextWell({ active, markActive, checkBarcode });

  const handleBarcodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    nextWell(true);
  };

  const getBarcode = useCallback(
    (id: number) => {
      let result = {
        id: 0,
        value: "",
        label: "",
        checking: false,
        result: "",
        valid: false,
        blocked: false,
        barcode: "",
        posName: "",
        name: "",
        error: "",
        askRetest: null,
      } as IBarcode;

      if (id == null || id === 0) {
        return result;
      }
      barcodes.map((barcode) => {
        if (barcode.id === id) {
          result = barcode;
        }
      });
      return result;
    },
    [barcodes]
  );

  const checkAllValid = () => {
    let result = true;
    if (!(barcodes.filter((barcode) => barcode.value).length >= 1)) {
      result = false;
    }
    barcodes.forEach((b) => {
      if (b.value.length >= 1 && (!b.valid || b.checking)) {
        result = false;
      }
    });
    setBarcodesValid(result);
    return result;
  };

  //open lid and select first active well on startup
  useEffect(() => {
    toggleLid();
    nextWell(true);
  }, []);

  useEffect(() => {
    setBarcodes((prevBarcodes) =>
      prevBarcodes.map((barcode) => {
        if (barcode.id === active) {
          return {
            ...barcode,
            askRetest:
              settings.account.allowRetest && settings.account.allowRetest,
          };
        } else {
          return barcode;
        }
      })
    );

    setInputName(getBarcode(active)?.label);
  }, [settings.account.allowRetest, settings.account.verifyBarcodes, active]);
  //check valid attribure of all barcodes to toggle button for next step
  useEffect(() => {
    checkAllValid();
  }, [barcodes]);

  //re check all barcodes on disabling offlineMode mode
  useEffect(() => {
    if (!offlineMode) {
      checkAll(barcodes.filter((barcode) => barcode.value.length > 0));
    }
  }, [offlineMode]);
  const handleReset = useCallback(() => {
    setBarcodes((prevBarcodes) =>
      prevBarcodes.map((barcode) => {
        if (barcode.id === active) {
          return {
            ...barcode,
            value: "",
            valid: false,
            error: "",
            checking: false,
            askRetest: false,
          };
        } else {
          return barcode;
        }
      })
    );

    setInputs({
      ...inputs,
      [getBarcode(active)?.label]: "",
    });
    if (textInput.current) textInput.current.focus();
  }, [barcodes, active]);

  return (
    <Block flex center height={"100%"} width="100%">
      <Block flex center column gap={20}>
        <HeaderSection />
        <RackVisualRows
          active={active}
          markActive={markActive}
          showResults={false}
          testmethod={null}
        />
        <InputSection
          active={active}
          updateBarcode={updateBarcode}
          nextWell={nextWell}
          disabled={disabled}
          keyboardActive={keyboardActive}
          setKeyboardActive={setKeyboardActive}
          getBarcode={getBarcode}
        />
        <ActionsSection
          active={active}
          barcodesValid={barcodesValid}
          getBarcode={getBarcode}
        />
        <BarcodeKeyboard
          active={active}
          nextWell={nextWell}
          onKeyPress={onKeyPress}
          keyboardActive={keyboardActive}
          setKeyboardActive={setKeyboardActive}
          getBarcode={getBarcode}
          inputs={inputs}
          inputName={inputName}
          setInputs={setInputs}
          clear={clear}
          setClear={setClear}
        />
      </Block>
    </Block>
  );
};

export default BarcodeInput;
