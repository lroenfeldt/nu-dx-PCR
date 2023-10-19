import React, { FC, forwardRef, memo, Ref } from "react";
import { TLabelProps } from "../types/components";

const Label: FC<TLabelProps> = forwardRef<HTMLLabelElement, TLabelProps>(
  (props: TLabelProps, ref: Ref<HTMLLabelElement>) => {
    const {
      row,
      flex,
      style,
      align,
      gap,
      padding,
      border,
      radius,
      width,
      cursor,
      children,
      htmlFor,
      ...rest
    } = props;

    const blockStyles = {
      ...style,
      ...(flex && { display: "flex" }),
      ...(row && { flexDirection: "row" }),
      ...(align && { alignItems: align }),
      ...(gap && { gap: gap }),
      ...(padding !== undefined && { padding }),
      ...(border && { border: border }),
      ...(radius && { borderRadius: radius }),
      ...(width && { width }),
      ...(cursor && { cursor: cursor }),
      ...(htmlFor && { htmlFor: htmlFor }),
    } as React.CSSProperties;
    return (
      <label ref={ref} style={{ ...blockStyles }} {...rest}>
        {children}
      </label>
    );
  }
);

export default memo(Label);
