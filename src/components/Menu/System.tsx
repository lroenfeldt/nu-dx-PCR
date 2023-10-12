import { Block, Ellipse, Next, Prev, Text } from "..";

const SystemInfo = ({ label, value }: { label: string; value: string }) => (
  <Block flex align="flex-start" alignSelf="strech" gap={16}>
    <Text h5>{label}</Text>
    <Text small>{value}</Text>
  </Block>
);

const StatusInfo = ({ label, status }: { label: string; status: string }) => (
  <Block flex align="center" alignSelf="strech" gap={16}>
    <Text h5>{label}</Text>
    <Block flex align="center" alignSelf="strech" gap={8}>
      <Text small>{status}</Text>
      <Ellipse />
    </Block>
  </Block>
);

const System = () => {
  return (
    <>
      <Block
        flex
        column
        align="flex-start"
        justify="flex-start"
        gap={44}
        width={436}
      >
        <Block flex width={436} height={595} column align="flex-start" gap={44}>
          <Block flex column align="flex-start" alignSelf="strech" gap={24}>
            <Text h3>System</Text>
            <SystemInfo label="Seriennummer:" value="440350" />
            <SystemInfo label="Hardware ID:" value="c4:00:ad:92:5c:25" />
            <SystemInfo label="Software Version:" value="1.0.23" />
          </Block>
          <Block flex column align="flex-start" alignSelf="strech" gap={16}>
            <Text h4>Status</Text>
            <StatusInfo label="Datenbankverbindung:" status="verbunden" />
            <StatusInfo label="Internetverbindung:" status="verbunden" />
          </Block>
          <Block flex column align="flex-start" alignSelf="strech" gap={24}>
            <Text h4>Updates</Text>
            <Text h5> Änderungsprotokoll Version 1.0.23</Text>
            <Block>
              <Text small>Installation</Text>
              <Text small>
                loreLorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. loreLorem ipsum dolor sit
                amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. loreLorem ipsum dolor sit amet, consectetuer adipiscing
                elit. Aenean commodo ligula eget dolor.
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
      <Block
        flex
        height="528px"
        padding="100px 0px"
        column
        justify="space-between"
        align="flex-start"
        position="absolute"
        right={0}
      >
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
