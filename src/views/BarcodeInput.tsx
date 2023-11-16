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

const BarcodeInput = () => {
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
  const [barcodeCheckTimeout, setBarcodeCheckTimeout] = useState<number | null>(
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

  const numberRegex = /^[0-9]+$/;
  const nextWell = useCallback(
    (next: boolean) => {
      let nextWell = active;

      const blockedBarcodes = barcodes
        .filter((barcode) => barcode.blocked === true)
        .map((blockedBarcode) => blockedBarcode.id);
      setDisabled(false);
      const wellCount = settings.device.wellCount;
      if (active <= wellCount && wellCount == 96) {
        for (let j = -13; j <= wellCount; j++) {
          if (next === true) {
            if (nextWell === 96 && blockedBarcodes.includes(1))
              return setDisabled(true);
            if (j === nextWell && blockedBarcodes.includes(nextWell + 12)) {
              if (nextWell + 24 === 97) return setDisabled(true);
              if (blockedBarcodes.includes(nextWell + 24))
                return markActive(nextWell + 36);
              return markActive(nextWell + 24);
            }
            if (
              j === nextWell &&
              j >= 85 &&
              blockedBarcodes.includes(nextWell - 83)
            )
              return markActive(nextWell - 83 + 12);
            if (j === nextWell && j === 96 && !blockedBarcodes.includes(1))
              return markActive(1);
            if (j === nextWell && j >= 85) return markActive(j - 83);
            if (j === nextWell && j < 85) return markActive(j + 12);
          } else {
            if (
              j === nextWell &&
              blockedBarcodes.includes(nextWell - 12) &&
              blockedBarcodes.includes(nextWell - 24)
            )
              return markActive(96);
            if (
              j === nextWell &&
              j > 12 &&
              j <= 24 &&
              nextWell - 12 === 1 &&
              blockedBarcodes.includes(nextWell - 12)
            )
              return markActive(96);
            if (j === nextWell && blockedBarcodes.includes(nextWell + 12))
              return markActive(nextWell + 24);
            if (
              j === nextWell &&
              j > 12 &&
              j <= 24 &&
              blockedBarcodes.includes(nextWell - 12)
            )
              return markActive(j - 12 + 83);
            if (j === nextWell && j <= 1) return markActive(96);
            if (j === nextWell && j <= 12) return markActive(j + 83);
            if (j === nextWell && j > 12) return markActive(j - 12);
          }
        }
      } else if (wellCount == 16 && active < 16) {
        do nextWell++;
        while (barcodes.find((barcode) => barcode.id === nextWell)?.blocked);
        markActive(nextWell);
      }
    },
    [active, barcodes, settings.device.wellCount, setBarcodes, setDisabled]
  );

  const updateBarcode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      clearTimeout(barcodeCheckTimeout as number);
      setInputs({
        ...inputs,
        [inputName]: e.target.value,
      });

      setBarcodesValid(false);
      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) => ({ ...barcode, checking: false }))
      );
      let newBarcode = getBarcode(active);
      newBarcode = {
        ...newBarcode,
        value: e.target.value,
        checking: true,
        valid: false,
        error: "",
      };
      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) =>
          barcode.id === active ? newBarcode : barcode
        )
      );

      setTimeout(() => {
        checkBarcode(newBarcode);
        setBarcodeCheckTimeout(null);
      }, 500);
    },

    [active, barcodes, barcodeCheckTimeout, setBarcodes, setBarcodeCheckTimeout]
  );

  const onKeyPress = useCallback(
    (value: string) => {
      clearTimeout(barcodeCheckTimeout as number);

      setBarcodesValid(false);
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

      setTimeout(() => {
        checkBarcode(newBarcode);
        setBarcodeCheckTimeout(null);
      }, 500);
    },
    [active, barcodes, barcodeCheckTimeout, setBarcodes, setBarcodeCheckTimeout]
  );

  const checkAll = useCallback(
    async (barcodes: IBarcode[]) => {
      for (let i = 0; i < barcodes.length; i++) {
        await checkBarcode(barcodes[i]);
      }
    },
    [offlineMode]
  );

  const trailingHandler = () => {
    if (settings.account.autoControlSamples === "Trailing") {
      setBarcodes((prevBarcodes) => {
        let lastNotEmptyIndex = prevBarcodes.reduce((index, barcode, i) => {
          return barcode.value !== "" ? i : index;
        }, 0);

        let newActive = lastNotEmptyIndex + 1;
        let count = 0;
        if (testprocedure.controlSamples.length > 0) {
          // Mapper les controlSamples sur les barcodes et les bloquer
          return prevBarcodes.map((barcode, index) => {
            const controlSample =
              testprocedure.controlSamples[
                index % testprocedure.controlSamples.length
              ];

            if (
              barcode.id === newActive + 1 &&
              count < testprocedure.controlSamples.length
            ) {
              count++;
              newActive++;
              return {
                ...barcode,
                blocked: true,
                label: controlSample.label,
                value: controlSample.label,
              };
            }
            return barcode;
          });
        }
        let tpcPosition = isNinetySix ? newActive + 12 : newActive + 1;
        let ntcPosition = isNinetySix ? newActive + 24 : newActive + 2;
        if (tpcPosition >= 85) {
          ntcPosition = ntcPosition - 83 - 12;
        }
        if (tpcPosition >= 97) {
          tpcPosition = tpcPosition - 83 - 12;
        }
        if (ntcPosition >= 97) {
          ntcPosition = ntcPosition - 83 - 12;
        }

        return prevBarcodes.map((barcode, index) => {
          if (
            (barcode.label === "NTC" || barcode.label === "TPC") &&
            barcode.id !== tpcPosition &&
            barcode.id !== ntcPosition
          ) {
            return {
              ...barcode,
              blocked: false,
              label: barcode.posName,
              value: "",
            };
          }

          if (barcode.id === tpcPosition && barcode.value === "") {
            return {
              ...barcode,
              blocked: true,
              label: "TPC",
            };
          }

          if (barcode.id === ntcPosition && barcode.value === "") {
            return {
              ...barcode,
              blocked: true,
              label: "NTC",
            };
          }

          return barcode;
        });
      });
    }
  };
  const navigateToTestReady = () => {
    if (settings?.account.autoControlSamples == "Trailing" && !trailing) {
      trailingHandler();
      setTrailing(true);
    } else {
      navigate("/testReady");
    }
  };

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
            code: errorProps.dbCon.code,
            id: errorProps.dbCon.id,
            type: "dbCon",
            message: t("errors.checkTestSampleFail"),
          });
        } else if (err.request) {
          console.log(err.request);
          window.api.logEvents(`request: ${JSON.stringify(err.request)}`);
          dbError = true;
          newErrors.push({
            code: errorProps.dbCon.code,
            id: errorProps.dbCon.id,
            type: "dbCon",
            message: t("errors.dbConnectionError"),
          });
        } else {
          console.log("Error", err.message);
          window.api.logEvents(`Error: ${err.message}`);
          dbError = true;
          newErrors.push({
            code: errorProps.dbCon.code,
            id: errorProps.dbCon.id,
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
        newBarcode.id === prevBarcode.id ? newBarcode : prevBarcode
      )
    );
  };

  let cancelToken;
  /**
   * check if the barcode meets the standards established for the barcode
   * @param {object} newBarcode
   * @returns
   */
  const checkBarcode = async (newBarcode: IBarcode) => {
    newBarcode = {
      ...newBarcode,
      checking: true,
      valid: false,
      error: "",
      label: newBarcode.posName,
    };

    setBarcodes((prevBarcodes) =>
      prevBarcodes.map((barcode) =>
        barcode.id === newBarcode.id ? newBarcode : barcode
      )
    );
    setInputs({ ...inputs, [newBarcode.label]: newBarcode.value }); // same value as input field

    let isValid = true;
    let validationErr = null;
    // break check
    if (!settings.account.verifyBarcodes) {
      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) =>
          barcode.id === newBarcode.id
            ? { ...barcode, checking: false, valid: true }
            : barcode
        )
      );
      return;
    }

    //Check for control placeholders
    // feature for testing
    const controlPlaceholders = [
      "Placeholder_NTC",
      "Placeholder_TPC",
      "SC2NTC",
      "SC2TPC",
      "TPC",
      "NTC",
    ];
    if (controlPlaceholders.includes(newBarcode.value)) {
      newBarcode = {
        ...newBarcode,
        checking: false,
        valid: true,
        error: t("errors.controlSampleDetected"),
      };

      if (
        newBarcode.value === "SC2NTC" ||
        newBarcode.value === "Placeholder_NTC" ||
        newBarcode.value === "NTC"
      ) {
        newBarcode.label = "NTC";
      }

      if (
        newBarcode.value === "SC2TPC" ||
        newBarcode.value === "Placeholder_TPC" ||
        newBarcode.value === "TPC"
      ) {
        newBarcode.label = "TPC";
      }

      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) =>
          barcode.id === newBarcode.id ? newBarcode : barcode
        )
      );
      return;
    }

    //check empty
    if (!(newBarcode.value.length >= 1)) {
      isValid = false;
    }
    //Check for special Barcodes
    if (
      newBarcode.value.substr(0, 1) === "R" ||
      newBarcode.value.indexOf("-R") !== -1
    ) {
      isValid = true;
    } else {
      //check characters
      for (const char of newBarcode.value) {
        if (!settings.account.allowedCharacters.includes(char)) {
          isValid = false;
          validationErr =
            t("errors.invalidcharacters") + settings.account.allowedCharacters;
        }
      }

      //check length
      if (!(newBarcode.value.length >= settings.account.minBarcodeLength)) {
        isValid = false;
        validationErr = t("errors.minBarcodeLength", {
          minLength: settings.account.minBarcodeLength,
        });
      }
      if (newBarcode.value.length > settings.account.maxBarcodeLength) {
        isValid = false;
        validationErr = t("errors.maxBarcodeLength", {
          maxLength: settings.account?.maxBarcodeLength,
        });
      }
    }

    //Check duplicates
    barcodes.forEach((barcode) => {
      if (barcode.error && barcode.error.includes(newBarcode.posName)) {
        const errBarcode = barcodes.find(
          (barcode) =>
            barcode.error && barcode.error.includes(newBarcode.posName)
        ) as IBarcode;
        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((barcode) =>
            barcode.id === errBarcode.id
              ? { ...barcode, error: "", valid: false }
              : barcode
          )
        );
      }
      if (barcode.error && barcode.error.includes(newBarcode.posName)) {
        const errBarcode = barcodes.find(
          (barcode) =>
            barcode.error && barcode.error.includes(newBarcode.posName)
        ) as IBarcode;
        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((barcode) =>
            barcode.id === errBarcode.id
              ? { ...barcode, error: "", valid: false }
              : barcode
          )
        );
      }
      if (
        barcode.value === newBarcode.value &&
        barcode.posName !== newBarcode.posName
      ) {
        isValid = false;
        validationErr = t("errors.barcodeAlreadyUsed", {
          position: barcode.posName,
        });
      }
    });

    //Check against db
    if (
      isValid &&
      newBarcode.value.indexOf("-R") === -1 &&
      settings.account.checkBarcodesDB &&
      settings.account.verifyBarcodes
    ) {
      if (offlineMode) {
        validationErr = t("errors.offlineModeMode");
        newBarcode = {
          ...newBarcode,
          checking: false,
          valid: isValid,
          error: validationErr,
        };

        setBarcodes((prevBarcodes) =>
          prevBarcodes.map((barcode) =>
            barcode.id === newBarcode.id ? newBarcode : barcode
          )
        );
      } else {
        setLoading(true);

        let askRetest = false;
        let newErrors = errors.filter((error) => error.type !== "dbCon");

        cancelToken = axios.CancelToken.source();

        try {
          let response = await axios.get(
            `${checkBarcodeUrl}/${newBarcode.value}`,
            {
              cancelToken: cancelToken.token,
            }
          );

          let result = response.data;
          if (result === null) {
            isValid = false;
            validationErr = t("errors.barcodeNotFound");
          } else if (result.status <= 3) {
            isValid = false;
            askRetest =
              settings.account.allowRetest && settings.account.verifyBarcodes;
            validationErr = t("errors.barcodeAlreadyInUse");
          } else if (
            settings.account.checkOrder &&
            result.orderKey !== settings.account.orderKey
          ) {
            isValid = false;
            validationErr = t("errors.barcodeNotInOrder");
          }

          setLoading(false);
        } catch (err: any) {
          setLoading(false);
          if (axios.isCancel(err)) {
            console.log("Request canceled", err.message);
          } else {
            if (err.code == "ERR_NETWORK") {
              console.log(err.request);
              window.api.logEvents(`request: ${JSON.stringify(err.request)}`);
              newErrors.push({
                type: "dbCon",
                message: t("errors.dbConnectionError"),
                code: errorProps.dbCon.code,
                id: errorProps.dbCon.id,
              });
              validationErr = t("errors.notVerifiedDbError");
            }
            if (err.response) {
              window.api.logEvents(
                `status: ${err.response.status} headers: ${
                  err.response.headers
                } data: ${JSON.stringify(err.response.data)}`
              );
              isValid = false;
              if (err.message === t("errors.noSamplesImported")) {
                validationErr = t("errors.useAnotherBarcode");
              } else {
                validationErr = t("errors.barcodeVerificationFailed", {
                  message: err.message,
                });
              }
            } else if (err.request) {
              window.api.logEvents(`request: ${JSON.stringify(err.request)}`);
              newErrors.push({
                type: "dbCon",
                message: t("errors.dbConnectionError"),
                code: errorProps.dbCon.code,
                id: errorProps.dbCon.id,
              });
              validationErr = t("errors.notVerifiedDbError");
            } else {
              console.log("Error", err.message);
              window.api.logEvents(`Error: ${err.message}`);
              newErrors.push({
                type: "dbCon",
                message: t("errors.dbConnectionError"),
                code: errorProps.dbCon.code,
                id: errorProps.dbCon.id,
              });
              validationErr = t("errors.notVerifiedDbError");
            }
          }
        } finally {
          setErrors(newErrors);

          newBarcode = {
            ...newBarcode,
            checking: false,
            valid: isValid,
            error: validationErr ? validationErr : "",
            askRetest: askRetest,
          };

          setBarcodes((prevBarcodes) =>
            prevBarcodes.map((barcode) =>
              barcode.id === newBarcode.id ? newBarcode : barcode
            )
          );
        }
      }
    } else {
      newBarcode = {
        ...newBarcode,
        checking: false,
        valid: isValid,
        error: validationErr ? validationErr : "",
      };

      setBarcodes((prevBarcodes) =>
        prevBarcodes.map((barcode) =>
          barcode.id === newBarcode.id ? newBarcode : barcode
        )
      );
    }
  };

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

  useEffect(() => {
    getBarcode(active).askRetest =
      settings.account.allowRetest && settings.account.verifyBarcodes;
    setInputName(getBarcode(active).label);
  }, [settings.account.allowRetest, settings.account.verifyBarcodes]);
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

  //Apply control samples
  useEffect(() => {
    if (
      testprocedure?.controlSamples.length > 0 &&
      settings.account.autoControlSamples !== "Trailing"
    ) {
      setBarcodes((prevBarcodes) => {
        return prevBarcodes.map((barcode) => {
          const controlSample = testprocedure?.controlSamples.find((sample) => {
            return (
              (!isNinetySix && barcode.label === sample.position16) ||
              (isNinetySix && barcode.label === sample.position96)
            );
          });

          if (controlSample) {
            return {
              ...barcode,
              blocked: true,
              label: controlSample.label,
              value: controlSample.label,
              valid: true,
            };
          } else {
            return barcode;
          }
        });
      });
    }
    setControlsApplied(true);
  }, [settings.account.autoControlSamples, isNinetySix]);

  //mark active well after applying controls
  useEffect(() => {
    if (controlsApplied) {
      nextWell(true);
    }
  }, [controlsApplied]);

  //open lid and select first active well on startup
  useEffect(() => {
    toggleLid();
  }, []);
  useEffect(() => {
    setInputName(getBarcode(active).label);
  }, [active]);

  const handleReset = useCallback(() => {
    setBarcodes(
      barcodes.map((barcode) => {
        if (barcode?.id === active) {
          return {
            ...barcode,
            checking: false,
            valid: false,
            error: "",
            value: "",
          };
        } else {
          return {
            ...barcode,
          };
        }
      })
    );
    setInputs({
      ...inputs,
      [getBarcode(active).label]: "",
    });
    if (textInput.current) textInput.current.focus();
  }, [barcodes, active]);

  return (
    <>
      <div className={`BarcodeInput ${isNinetySix ? " ninetySix" : ""}`}>
        {!isNinetySix && <h3>{t("barcodeInput.instructions")}</h3>}
        <RackVisualRows
          active={active}
          markActive={markActive}
          showResults={false}
          testmethod={testprocedure}
        />

        <div className={`inputContainer ${isNinetySix ? " ninetySix" : ""}`}>
          {isNinetySix && <h3>{t("barcodeInput.instructions")}</h3>}
          {getBarcode(active).error &&
          !getBarcode(active).checking &&
          getBarcode(active)?.value.length >= 1 ? (
            <div
              className={`barcodeValidationMsg ${
                isNinetySix ? " ninetySix" : ""
              }`}
            >
              <span>{getBarcode(active).error}</span>
            </div>
          ) : (
            ""
          )}
          <form action="" onSubmit={(e) => handleBarcodeSubmit(e)}>
            {isNinetySix && (
              <Block
                column
                gap={10}
                shadow
                radius={10}
                padding={12}
                marginBottom={keyboardActive ? -180 : ""}
              >
                <div className="inputBlock">
                  <ActivateKeyboard
                    onClick={() => {
                      setKeyboardActive(!keyboardActive);
                      if (textInput.current) {
                        textInput?.current.setSelectionRange(
                          textInput.current.value.length,
                          textInput.current.value.length
                        );
                        textInput.current.focus();
                      }
                    }}
                  />
                  <input
                    id={getBarcode(active).label}
                    ref={textInput}
                    onFocus={() => {
                      setInputName(getBarcode(active).label);
                      setInputs({
                        ...inputs,
                        [getBarcode(active).label]: getBarcode(active).value,
                      });
                    }}
                    autoFocus
                    type="text"
                    value={getBarcode(active).value || ""}
                    onChange={(e) => updateBarcode(e)}
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                  />
                  {getBarcode(active).value != "" && (
                    <div className="icon" onClick={() => handleReset()}>
                      <IoMdCloseCircle size={30} />
                    </div>
                  )}
                </div>
                <Controller onClick={nextWell} disabled={disabled} />
              </Block>
            )}
            {!isNinetySix && (
              <div className="inputBlock">
                <ActivateKeyboard
                  onClick={() => {
                    setKeyboardActive(!keyboardActive);
                    if (textInput?.current) textInput.current.focus();
                  }}
                />

                <input
                  id={getBarcode(active).label}
                  ref={textInput}
                  onFocus={() => setInputName(getBarcode(active).label)}
                  autoFocus
                  type="text"
                  value={getBarcode(active).value}
                  onChange={(e) => updateBarcode(e)}
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                />
                {getBarcode(active).value != "" && (
                  <div className="icon" onClick={() => handleReset()}>
                    <IoMdCloseCircle size={30} />
                  </div>
                )}
              </div>
            )}
            <Keyboard
              inputs={inputs}
              inputName={inputName}
              onChange={(e) => onKeyPress(e)}
              setInputs={setInputs}
              clear={clear}
              setClear={setClear}
              visible={keyboardActive}
              setVisible={setKeyboardActive}
              inputValue={getBarcode(active).value}
              isNumeric={numberRegex.test(settings.account.allowedCharacters)}
            />
            {getBarcode(active).askRetest && getBarcode(active).value != "" ? (
              <button onClick={() => retest(getBarcode(active))}>
                {t("common.retest")}
              </button>
            ) : (
              ""
            )}
            {!isNinetySix && active < 16 && (
              <button type="submit">{t("common.continue")}</button>
            )}
          </form>
        </div>
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
          onClick={navigateToTestReady}
          className={`${!barcodesValid ? "disabled" : ""}`}
        >
          {!trailing && settings.account.autoControlSamples == "Trailing"
            ? t("default.common.continue")
            : t("default.common.testStart")}
        </button>
      </div>
    </>
  );
};

export default BarcodeInput;
