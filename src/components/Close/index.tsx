import { FC, MouseEventHandler } from "react";
import CloseIcon from "../Icons/Close";
import useCloseStyle from "./useCloseStyle";
interface CloseProps {
  onClick?: MouseEventHandler;
}

const Close: FC<CloseProps> = ({ onClick }) => {
  const styles = useCloseStyle();
  return (
    <div style={styles.closeBtn} onClick={onClick}>
      <CloseIcon />
    </div>
  );
};

export default Close;
