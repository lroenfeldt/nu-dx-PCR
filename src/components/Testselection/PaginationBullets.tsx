import { Block } from "..";
import { IPaginationBulletsProps } from "../../types/components";

const PaginationBullets: React.FC<IPaginationBulletsProps> = ({
  numberOfPages,
  currentPage,
  goToPage,
}) => {
  return (
    <Block
      flex
      position="fixed"
      bottom="9%"
      left={"50%"}
      transform="translateX(-50%)"
      transition="all 0.3s ease-in-out"
      border="0px solid transparent"
      cursor
    >
      {Array.from({ length: numberOfPages || 0 }, (_, i) => (
        <Block
          key={i}
          width={20}
          height={20}
          radius={10}
          marginRight={10}
          secondary={i === currentPage}
          primary
          onClick={() => goToPage(i)}
        />
      ))}
    </Block>
  );
};

export default PaginationBullets;
