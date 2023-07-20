import { useTranslation } from '../../hooks';

interface TestStatusProp {
  status: string;
}
function TestStatus({ status }: TestStatusProp) {
  const { t }: any = useTranslation();
  return <div className={`status ${status}`}>{t(`default.common.${status}`)}</div>;
}

export default TestStatus;
