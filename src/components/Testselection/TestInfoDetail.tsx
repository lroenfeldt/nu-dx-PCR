import React from "react";
import Text from "../Text";
import { ITestInfoDetailProps } from "../../types/components";

const TestInfoDetail: React.FC<ITestInfoDetailProps> = ({
  Icon,
  title,
  detail,
  styles,
}) => (
  <div style={styles.testInfoDetails}>
    <div style={styles.testInfoDetailsLeft}>
      <Icon /> <Text p>{title}</Text>
    </div>
    <Text p>{detail}</Text>
  </div>
);

export default TestInfoDetail;
