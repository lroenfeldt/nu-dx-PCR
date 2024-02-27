import { useNavigate } from "react-router-dom";
import { Button } from "../..";
import { useData, useTranslation } from "../../../hooks";
import { table, tbdoyTr, tbody, td, th, thead, tr } from "./TableStyle";
import { useCallback } from "react";

interface TableRef {
  // ref: React.RefObject<HTMLTableSectionElement> | undefined;
  methodid: string | number;
}
const Table = () => {
  const { t } = useTranslation();
  const { settings, setInfo, setSelectedMethod, selectedMethod } = useData();
  const navigate = useNavigate();

  const selectTest = useCallback(() => {
    if (
      settings.account.hasUserAuthentification ||
      settings.account.askForLot
    ) {
      navigate("/enterBarcodes");
      // navigate("/auth");
    } else {
      navigate("/enterBarcodes");
    }
  }, [
    selectedMethod,
    settings.account.askForLot,
    settings.account.hasUserAuthentification,
  ]);

  const options = [
    t("common.testName"),
    t("common.runTime"),
    t("common.producer"),
    t("common.testInfo"),
    t("common.toTest"),
  ];

  return (
    <table style={table}>
      <thead style={thead}>
        <tr>
          {options.map((opt, i) => {
            return (
              <th style={th} key={i}>
                {opt}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody style={tbody}>
        {settings.account.testprocedures.map((opt, i) => {
          return (
            <tr style={i % 2 === 1 ? tbdoyTr : tr} key={i}>
              <td style={td}>{opt.labelDE}</td>
              <td style={td}>{opt.durationMinutes}</td>
              <td style={td}>{opt.durationMinutes}</td>
              <td style={td}>
                <Button
                  outlined
                  onClick={() => {
                    setInfo(true);
                    setSelectedMethod(opt.id as string);
                  }}
                >
                  {t("common.testInfo")}
                </Button>
              </td>
              <td style={td}>
                {<Button onClick={selectTest}>{t("common.select")}</Button>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
