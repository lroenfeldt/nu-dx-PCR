import { FC, ReactNode } from "react";
import { Block } from "..";

interface ContainerProps {
  children: ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <Block background radius={16} height={"100%"} width={"100%"}>
      {children}
    </Block>
  );
};

export default Container;
