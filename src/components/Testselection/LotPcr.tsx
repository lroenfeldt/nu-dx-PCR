import { Block, Button, Input, Text } from "..";

const LotPcr = () => {
  return (
    <Block flex column center alignCenter height={"90%"} width={"100%"}>
      <Block width={"527px"} gap={32}>
        <Text h2>LOT Kit PCR</Text>
        <Text h4>
          Um direkt zum Test zu gelangen, scannen sie den Barcode der
          Chargennummer oder nutzen Sie die Tastatur zur Eingabe des Barcodes.
        </Text>
        <Block flex row marginTop={32}>
          <Input />
        </Block>
        <Block flex row marginTop={32} gap={32} center>
          <Button onClick={() => window.history.back()} width={197}>
            Abbrechen
          </Button>
          <Button width={197}>Weiter</Button>
        </Block>
      </Block>
    </Block>
  );
};

export default LotPcr;
