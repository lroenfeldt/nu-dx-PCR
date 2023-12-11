import { Block, Modal, Text } from "..";
import { colors } from "../../assets/theme";
import { useData } from "../../hooks";
import { Arrow, Clock, Funnel } from "../Icons";
import ProfileSmall from "../Icons/ProfileSmall";

const MenuButton = (props: {
  icon: JSX.Element;
  children: React.ReactNode;
  rightIcon: JSX.Element;
}) => {
  return (
    <Block
      height={63}
      padding="12px 24px"
      flex
      row
      spaceBetween
      alignCenter
      cursor
    >
      <Block
        onClick={() => {
          // handleChange
        }}
        flex
        row
        alignCenter
        gap={10}
      >
        {props.icon}
        <Text color={colors.text.main} h5 style={{ fontWeight: 500 }}>
          {props.children}
        </Text>
      </Block>
      {props.rightIcon}
    </Block>
  );
};

const FiltereMenu = (_props: { onClose: () => void }) => {
  return (
    <Block radius={16} white width={284} dropShadowSmall>
      <Block borderBottom={`1px solid ${colors.grey[500]}`}>
        <MenuButton
          icon={<Funnel fill={colors.text.main} />}
          children={"Testname"}
          rightIcon={<Arrow fill={colors.text.main} />}
        />
      </Block>
      <Block borderBottom={`1px solid ${colors.grey[500]}`}>
        <MenuButton
          icon={<Clock fill={colors.text.main} />}
          children={"Laufzeit"}
          rightIcon={<Arrow fill={colors.text.main} />}
        />
      </Block>
      <MenuButton
        icon={<ProfileSmall fill={colors.text.main} />}
        children={"Hersteller"}
        rightIcon={<Arrow fill={colors.text.main} />}
      />
    </Block>
  );
};

const FiltereMenuHolder = () => {
  const { filterMenu, setFilterMenu } = useData();
  return (
    <>
      {filterMenu ? (
        <Modal
          style={{
            right: 0,
            top: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            WebkitBackdropFilter: "blur(0px)",
            alignItems: "flex-start",
            paddingTop: 87,
            paddingLeft: 300,
          }}
          isVisible={filterMenu}
          setIsVisible={() => setFilterMenu(false)}
        >
          <FiltereMenu onClose={() => setFilterMenu(false)} />
        </Modal>
      ) : null}
    </>
  );
};

export default FiltereMenuHolder;
