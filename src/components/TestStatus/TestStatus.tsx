import { ITestStatus } from "../../types/components";
import { useTranslation } from "../../hooks";

function TestStatus({ status }: ITestStatus) {
  const { t } = useTranslation();
  return (
    <div className={`status ${status}`}>{t(`default.common.${status}`)}</div>
  );
}

export default TestStatus;
