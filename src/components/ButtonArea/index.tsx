import { IButtonArea } from '../../types/interfaces/components';

const ButtonArea = (props: IButtonArea) => {
  const { children, noborder, ...rest } = props;
  const buttonAreaClass = [noborder && 'noborder', 'buttonArea']
    .filter((el) => typeof el != undefined && el != false)
    .join(' ');

  return (
    <div className={buttonAreaClass} {...rest}>
      {children}
    </div>
  );
};

export default ButtonArea;
