import { useRef } from "react";
import { Block, Prev } from "../..";
import Table from "./Table";

const TableView = () => {
  const startPoint = useRef<HTMLTableSectionElement>(null);
  const scroll = (direction: "up" | "down") => {
    const el = startPoint.current;
    if (!el) return;

    const scrollHeight = 150;
    const scrollAmount = direction === "up" ? -scrollHeight : scrollHeight;

    el.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Block width="100%" flex row>
      <Table />
      <Block
        position="absolute"
        top={"45%"}
        right={-65}
        transform="rotate(90deg)"
        flex
        row
        center
        alignCenter
        gap={100}
      >
        <Block
          transition="all 0.3s ease-in-out"
          border="0px solid transparent"
          cursor
          onClick={() => scroll("up")}
        >
          <Prev />
        </Block>
        <Block
          transform="scaleX(-1)"
          transition="all 0.3s ease-in-out"
          border="0px solid transparent"
          cursor
          onClick={() => scroll("down")}
        >
          <Prev />
        </Block>
      </Block>
    </Block>
  );
};

export default TableView;
