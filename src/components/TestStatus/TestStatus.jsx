import React from "react";
import { useTranslation } from "../../hooks";
function TestStatus({ status }) {
	const { t } = useTranslation();
	return <div className={`status ${status}`}>{t(`default.common.${status}`)}</div>;
}

export default TestStatus;
