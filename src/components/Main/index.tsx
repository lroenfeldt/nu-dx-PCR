import React, { ReactNode } from "react";

import { Block } from "..";
interface ContentProps {
  children: ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <Block
      flex
      column
      secondary
      height={"100vh"}
      width={"100%"}
      overflow="hidden"
    >
      {children}
    </Block>
  );
};

export default Content;
