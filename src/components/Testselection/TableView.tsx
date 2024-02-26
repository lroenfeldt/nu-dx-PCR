import { Table } from "..";
import { useData, useTranslation } from "../../hooks";

const TableView = () => {
  const { t } = useTranslation();
  const { settings } = useData();
  // t("common.testName"),
  // t("common.runTime"),
  // t("common.producer"),
  // t("common.testInfo"),
  // t("common.directTest"),
  return (
    <Table
      th={[]}
      tr={[
        settings.account.testprocedures.map((test) => {
          return (
            <>
              {test.labelEN}
              {/* {test.durationMinutes} */}
              {/* {test.name} */}
            </>
          );
        }),
      ]}
    />
  );
};

export default TableView;
