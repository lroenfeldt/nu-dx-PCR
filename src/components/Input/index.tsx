interface InputProps {
  type?: React.HTMLInputTypeAttribute | undefined;
  value?: string | number | readonly string[] | undefined;
  name?: string | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  placeholder?: string | undefined;
  label: string;
}

const Input = ({ type, value, name, onChange, placeholder, label }: InputProps) => {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}

      <input type={type} value={value} name={name} onChange={onChange} placeholder={placeholder} id={name} />
    </div>
  );
};

export default Input;
