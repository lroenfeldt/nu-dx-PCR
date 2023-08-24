import { IInput } from '../../types/interfaces/interfaces';

const Input = ({ type, value, name, onChange, placeholder, label }: IInput) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}

      <input type={type} value={value} name={name} onChange={onChange} placeholder={placeholder} id={name} />
    </div>
  );
};

export default Input;
