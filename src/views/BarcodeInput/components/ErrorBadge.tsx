import { FC } from "react";
import { Block, Text, Alert } from "../../../components";
import { useTheme } from "../../../assets/theme/ThemeContext";
import { IErrorBadgeProps } from "../../../types/interfaces/views";

const ErrorBadge: FC<IErrorBadgeProps> = ({ error }) => {
  const { colors, borders } = useTheme();
  return (
    <Block
      inlineFlex
      gap={8}
      padding="8px 16px "
      align="center"
      bgColor={colors.error.alert}
      radius={borders.borderRadius.badge}
    >
      <Alert />
      <Text p>{error}</Text>
    </Block>
  );
};

export default ErrorBadge;
