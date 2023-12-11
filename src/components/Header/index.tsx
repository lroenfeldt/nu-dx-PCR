import { useBackgroundProcesses } from "../../hooks";
import { useLocation } from "react-router-dom";
import { Block } from "..";
import { useTheme } from "../../assets/theme";
import PaginationButtons from "./PaginationButtons";
import BackButton from "./BackButton";
import ViewType from "./ViewType";
import RightButtons from "./RightButtons";
import OpenMenu from "./OpenMenu";

const Header = () => {
  const location = useLocation();
  const { colors } = useTheme();
  useBackgroundProcesses();

  return (
    <Block
      flex
      row
      padding="0 24px"
      justify="space-between"
      align="center"
      secGrad
      height="64px"
    >
      <Block
        flex
        align="center"
        gap={11}
        padding="8px 26px"
        center
        bgColor={
          location.pathname === "/selectMethod" ? null : colors.secondary.focus
        }
      >
        {location.pathname === "/selectMethod" ? null : <BackButton />}
      </Block>

      {location.pathname === "/selectMethod" && <PaginationButtons />}

      {location.pathname === "/ViewResults" && <ViewType />}

      <RightButtons />

      <OpenMenu />
    </Block>
  );
};

export default Header;
