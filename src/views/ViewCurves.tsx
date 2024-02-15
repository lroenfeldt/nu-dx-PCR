import Line from "../components/Charts/Line";
import { useParams } from "react-router-dom";
import { useTranslation, useData } from "../hooks";
import { Block, Button, ButtonArea, ResultsFooter } from "../components";

function ViewCurves() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { barcodes, selectedMethod, settings, handleOpenEdit } = useData();

  const barcode = id
    ? barcodes.find((barcode) => barcode.id === parseInt(id))
    : null;
  const testmethod = settings.account.testprocedures.find(
    (procedure) => procedure.id === selectedMethod
  );
  return (
    <div>
      <Block center>
        <div
          style={{
            width: "150vh",
            height: "45vh",
          }}
        >
          {barcode && <Line barcode={barcode} />}
        </div>
      </Block>

      <Block
        center
        gap={30}
        position="absolute"
        align="baseline"
        bottom={-127}
        style={{
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <ButtonArea
          style={{
            left: "auto",
            right: "auto",
            bottom: "auto",
            transform: "none",
            position: "relative",
          }}
        >
          <Button onClick={() => window.history.go(-1)}>
            {t("common.back")}
          </Button>
        </ButtonArea>
        {barcode && testmethod && (
          <ResultsFooter activeBarcode={barcode} testmethod={testmethod} />
        )}
      </Block>
    </div>
  );
}

export default ViewCurves;
