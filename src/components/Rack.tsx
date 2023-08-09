import { IChildren } from '../types/interfaces/interfaces';

const Rack = ({ children }: IChildren) => {
  return <div className="rackRow">{children}</div>;
};

export default Rack;
