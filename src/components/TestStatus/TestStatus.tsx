import { useTranslation } from '../../hooks';
import { ITestStatus } from '../../types/interfaces/interfaces';

function TestStatus({ status }: ITestStatus) {
  const { t } = useTranslation();
  return <div className={`status ${status}`}>{t(`default.common.${status}`)}</div>;
}

export default TestStatus;
