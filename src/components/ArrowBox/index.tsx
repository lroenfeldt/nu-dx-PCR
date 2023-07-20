import './css/style.css';

interface ArrowBoxProps {
  children: JSX.Element;
  style: {} | undefined;
  direction: string;
}

function ArrowBox({ children, direction, style }: ArrowBoxProps) {
  return (
    <div className={`arrow_box ${direction}`}>
      <div className="content" style={{ ...style }}>
        {children}
      </div>
    </div>
  );
}

export default ArrowBox;
