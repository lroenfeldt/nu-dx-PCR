import { useCallback } from "react";
import { Block, Button, Text } from ".";
import { useTheme } from "../assets/theme";
import { useData, useResults, useTranslation } from "../hooks";
import { IViewResultsModal } from "../types/components";
import { ClosingIcon, CloudSmall } from "./Icons";
import OvalSpinner from "./OvalSpinner";

const ViewResultsModal: React.FC<IViewResultsModal> = ({ onClose }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { reading, submitting, testid, resultSubmitted } = useData();
  const { saveToUSB, submitResult } = useResults();

  const submitToCloud = useCallback(() => {
    submitResult(testid, resultSubmitted);
  }, [testid, resultSubmitted]);

  const toUSBSave = useCallback(() => {
    saveToUSB(testid, resultSubmitted);
  }, [testid, resultSubmitted]);

  return (
    <>
      <Block
        width="798px"
        height="397.5px"
        padding={32}
        dropShadowLarge
        radius={16}
        marginBottom={50}
        bgColor="#FFF"
      >
        <Block flex spaceBetween row alignCenter>
          <Block marginBottom={32}>
            <Text h3>{t("results.resutltExport")}</Text>
          </Block>
          <Block
            width="64px"
            height="64px"
            radius={50}
            border={`5px solid ${colors.primary.main}`}
            flex
            center
            alignCenter
            marginTop={-137}
            bgColor="#FFF"
            marginRight={-62}
            cursor
            onClick={onClose}
          >
            <ClosingIcon style={{ height: "35px", width: "35px" }} />
          </Block>
        </Block>
        <Block flex spaceBetween row marginBottom={48}>
          <Text style={{ width: "50%" }} h4>
            {t("results.cloud")}
          </Text>
          <Button onClick={submitToCloud} width="280px" height="56px">
            <Block flex center row gap={10} alignCenter>
              {submitting || reading ? (
                <Block grid center height="90vh" alignCenter>
                  <OvalSpinner size="40px" />
                </Block>
              ) : (
                <>
                  <CloudSmall style={{ height: "24px", width: "24px" }} />
                  <Text h4 white fontWeight={600}>
                    {t("results.cloudExport")}
                  </Text>
                </>
              )}
            </Block>
          </Button>
        </Block>
        <Block flex spaceBetween row alignCenter>
          <Text style={{ width: "50%" }} h4>
            {t("results.usbExport")}
          </Text>
          <Block flex column gap={24}>
            <Button onClick={toUSBSave} outlined width="280px" height="56px">
              <Text h4 color={colors.primary.main} fontWeight={600}>
                {t("results.csvExport")}
              </Text>
            </Button>
            <Button onClick={toUSBSave} outlined width="280px" height="56px">
              <Text h4 color={colors.primary.main} fontWeight={600}>
                {t("results.pdfExport")}
              </Text>
            </Button>
          </Block>
        </Block>
      </Block>
    </>
  );
};

export default ViewResultsModal;
