import { Table } from "..";
import { useData, useTranslation } from "../../hooks";

const TableView = () => {
  const { t } = useTranslation();
  const { results } = useData();
  return (
    <Table
      th={[
        t("common.testName"),
        t("common.runTime"),
        t("common.producer"),
        t("common.testInfo"),
        t("common.directTest"),
      ]}
      tr={[]}
    />
  );
};

export default TableView;
