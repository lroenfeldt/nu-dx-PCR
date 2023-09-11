import React from "react";
import { Block, Button, Input, Logout, Text } from "..";
import { useData, useTranslation, useTheme } from "../../hooks";

const Profil = () => {
	const { settings } = useData();
	const { t } = useTranslation();
	const { colors } = useTheme();
	return (
		<>
			<Block flex column align="flex-start" justify="flex-start" gap={44} width={436}>
				<Block flex column align="flex-start" justify="flex-start" gap={16}>
					<Text h3>Profil </Text>
					<Text p>{settings.account.data.name} </Text>
					<Text p>{settings.account.data.email} </Text>
					<Button secondary row flex padding={"14px 32px"} gap={16}>
						<Logout />
						<Text p label>
							{t("common.logout")}
						</Text>
					</Button>
				</Block>
				<Block flex column align="flex-start" height={192} justify="flex-start" gap={24} alignSelf="stretch">
					<Text h4>Sprache </Text>

					<Block flex row align="center" gap={16} padding={"16px 32px"} border={`3px solid ${colors.secondary.main}`} radius={8} width={198}>
						<Input type="radio" value="de" name="lang" width={20} height={20} /> <Text p>Deutsch</Text>
					</Block>
					<Block flex row align="center" gap={16} padding={"16px 32px"} border={`3px solid ${colors.secondary.main}`} radius={8} width={198}>
						<Input type="radio" value="en" name="lang" width={20} height={20} /> <Text p>English</Text>
					</Block>
					<Block flex row align="center" gap={16} padding={"16px 32px"} border={`3px solid ${colors.secondary.main}`} radius={8} width={198}>
						<Input type="radio" value="fr" name="lang" width={20} height={20} /> <Text p>Français</Text>
					</Block>
				</Block>
			</Block>
		</>
	);
};

export default Profil;
