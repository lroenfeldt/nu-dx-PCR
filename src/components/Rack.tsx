interface RackProp {
  children: JSX.Element;
}

const Rack = ({ children }: RackProp) => {
  return <div className="rackRow">{children}</div>;
};

export default Rack;
