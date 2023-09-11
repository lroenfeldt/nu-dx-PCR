import { useState, useEffect } from "react";

import { useData } from "../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import Server from "../Icons/Server";
import Ellipse from "../Icons/Ellipse";
import useFooterStyle from "./useFooterStyle";
import { Block, Text } from "..";
import { useTheme } from "../../assets/theme";
const Footer = () => {
	const { settings, dbConnection } = useData();
	const navigate = useNavigate();
	const location = useLocation();
	const [stateTime, setStateTime] = useState(new Date().toLocaleString());
	const { colors } = useTheme();
	useEffect(() => {
		const interval = setInterval(() => {
			setStateTime(new Date().toLocaleString());
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	const footerStyle = useFooterStyle();
	return (
		<Block flex secGrad justify="space-between" align="center" padding={"12px 24px"} height="56px" position="relative">
			<Block flex gap={11} center align="center" onDoubleClick={() => navigate("/debug")}>
				<Text p white>
					{settings.account.data.name}
				</Text>
			</Block>
			<Block style={footerStyle.footerLogo}></Block>
			<Block flex row align="center" justify="flex-end" gap={32}>
				<Text p white>
					{stateTime}
				</Text>
				<Server />
				<Ellipse />
			</Block>
		</Block>
	);
};

export default Footer;
