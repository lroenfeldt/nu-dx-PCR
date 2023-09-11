import React from "react";
import { Block, Ellipse, Next, Prev, Text } from "..";

const System = () => {
	return (
		<>
			<Block flex column align="flex-start" justify="flex-start" gap={44} width={436}>
				<Block flex width={436} height={595} column align="flex-start" gap={44}>
					<Block flex column align="flex-start" alignSelf="strech" gap={24}>
						<Text h3>System</Text>

						<Block flex column align="flex-start" alignSelf="strech" gap={16}>
							<Block flex align="flex-start" alignSelf="strech" gap={16}>
								<Text h5>Seriennummer: </Text> <Text small>440350</Text>
							</Block>
							<Block flex align="flex-start" alignSelf="strech" gap={16}>
								<Text h5>Hardware ID:</Text> <Text small>c4:00:ad:92:5c:25</Text>
							</Block>
							<Block flex align="flex-start" alignSelf="strech" gap={16}>
								<Text h5>Software Version::</Text> <Text small>1.0.23</Text>
							</Block>
						</Block>
					</Block>
					<Block flex column align="flex-start" alignSelf="strech" gap={16}>
						<Text h4>Status</Text>
						<Block flex align="center" alignSelf="strech" gap={16}>
							<Text h5>Datenbankverbindung: </Text>{" "}
							<Block flex align="center" alignSelf="strech" gap={8}>
								<Text small>verbunden</Text> <Ellipse />
							</Block>
						</Block>
						<Block flex align="center" alignSelf="strech" gap={16} justify="space-between">
							<Text h5>Internetverbindung:</Text>
							<Block flex align="center" alignSelf="strech" gap={8}>
								<Text small>verbunden</Text> <Ellipse />
							</Block>
						</Block>
					</Block>
					<Block flex column align="flex-start" alignSelf="strech" gap={24}>
						<Text h4>Updates</Text>
						<Text h5> Änderungsprotokoll Version 1.0.23</Text>
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

export default System;
