import { FC, ReactNode } from "react";
import { Block } from "..";
import { useLocation } from "react-router-dom";

interface ContainerProps {
	children: ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
	const location = useLocation();
	return (
		<Block background radius={16} height={"100%"} width={"100%"}>
			{children}
		</Block>
	);
};

export default Container;
