interface DropdownProps {
  title: string;
  elements: string[];
  handleClick?: (arg: string) => void;
}

export default function Dropdown({ title, elements, handleClick }: DropdownProps) {
  return (
    <div className="dropdown">
      <button className="dropbtn">{title.toUpperCase()}</button>
      <div className="dropdown-content">
        {elements.map((element: string) => (
          <div onClick={() => handleClick && handleClick(element)} key={element}>
            {element}
          </div>
        ))}
      </div>
    </div>
  );
}
