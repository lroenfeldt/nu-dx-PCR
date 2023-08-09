import './css/style.css';
import { IArrowBox } from '../../types/interfaces/interfaces';

function ArrowBox({ children, direction, style }: IArrowBox) {
  return (
    <div className={`arrow_box ${direction}`}>
      <div className="content" style={{ ...style }}>
        {children}
      </div>
    </div>
  );
}

export default ArrowBox;
