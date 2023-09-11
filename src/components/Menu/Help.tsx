import React from "react";
import { Block, Next, Prev, Text } from "..";

const Help = () => {
	return (
		<>
			<Block flex column align="flex-start" justify="flex-start" gap={44} width={496}>
				<Block flex width={436} height={595} column align="flex-start" gap={44}>
					<Block flex column align="flex-start" alignSelf="strech" gap={24}>
						<Text h3>Help</Text>
						<Text small>Bitten wenden Sie sich bei Problemen an den technischen Support</Text>
						<Block flex column align="flex-start" alignSelf="strech" gap={16}>
							<Text h4>Technischer Support</Text>
							<Block flex align="flex-start" alignSelf="strech" gap={16}>
								<Text h5>E-Mail: </Text> <Text small>support@nu-diagnostics.com</Text>
							</Block>
							<Block flex align="flex-start" alignSelf="strech" gap={16}>
								<Text h5>Telefon:</Text> <Text small>+49 123 456 789</Text>
							</Block>
						</Block>
					</Block>
					<Block flex column align="flex-start" alignSelf="strech" gap={24}>
						<Text h4>Anleitung tbd</Text>
						<Block>
							<Text small> Installation</Text>
							<Text small>
								loreLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. loreLorem ipsum dolor sit amet,
								consectetuer adipiscing elit. Aenean commodo ligula eget dolor. loreLorem ipsum dolor sit amet, consectetuer adipiscing elit.
								Aenean commodo ligula eget dolor.{" "}
							</Text>
						</Block>
					</Block>
				</Block>
			</Block>
			<Block flex height="528px" padding="100px 0px" column justify="space-between" align="flex-start" position="absolute" right={0}>
				<Block transform="rotate(-90deg)">
					<Next />
				</Block>
				<Block transform="rotate(-90deg)">
					<Prev />
				</Block>
			</Block>
		</>
	);
};

export default Help;
