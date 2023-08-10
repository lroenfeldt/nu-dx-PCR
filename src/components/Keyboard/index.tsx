import './style.css';
import { IoCloseCircle } from 'react-icons/io5';
import SimpleKeyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useEffect, useState, useRef, memo } from 'react';
import { IKeyboard, IKeyboardRef } from '../../types/interfaces/interfaces';

function Keyboard(props: IKeyboard) {
  const [layoutName, setLayoutName] = useState('default');
  const {
    dark,
    style,
    clear,
    inputs,
    visible,
    onChange,
    setClear,
    setInputs,
    inputName,
    setVisible,
    isNumeric = false,
  } = props;

  const keyboard = useRef<IKeyboardRef | null>(null);

  const onClear = () => {
    keyboard.current?.clearInput();
  };

  const onChangeAll = (newInput: any) => {
    setInputs((prevInputs: any) => ({ ...prevInputs, ...newInput }));
    console.log('Inputs changed', inputs);
  };

  const onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default');
    }
    if (button === '{enter}') {
      setVisible(false);
    }
  };

  const layout = {
    default: [
      '^ 1 2 3 4 5 6 7 8 9 0 ß ´ {bksp}',
      '{tab} q w e r t z u i o p ü +',
      '{lock} a s d f g h j k l ö ä # {enter}',
      '{shift} < y x c v b n m , . - {shift}',
      '.com @ {space}',
    ],
    shift: [
      '° ! " § $ % & / ( ) = ? ` {bksp}',
      '{tab} Q W E R T Z U I O P Ü *',
      "{lock} A S D F G H J K L Ö Ä ' {enter}",
      '{shift} > Y X C V B N M ; : _ {shift}',
      '.com @ {space}',
    ],
    numeric: ['1 2 3 4 5 6 7 8 9', '{bksp} 0 {enter}'],
  };

  useEffect(() => {
    keyboard.current?.setInput(inputs[inputName]);
  }, [inputs, inputName, visible]);

  useEffect(() => {
    if (clear) {
      onClear();
      setClear(false);
    }
  }, [clear]);

  useEffect(() => {
    const keyboard = document.getElementById('keyboard');

    if (visible) {
      window.onclick = function (event) {
        if (event.target == keyboard) {
          setVisible(false);
        }
      };
    }

    setLayoutName(isNumeric ? 'numeric' : 'default');
  }, [visible, isNumeric]);

  if (!visible) return null;

  return (
    <div
      id="keyboard"
      className={`${visible ? 'visible' : ''} `}
      style={{
        top: 0,
        left: 0,
        ...style,
      }}
    >
      <IoCloseCircle onClick={() => setVisible(false)} className="close-icon" />
      <SimpleKeyboard
        keyboardRef={(r) => (keyboard.current = r)}
        inputName={inputName}
        onChangeAll={onChangeAll}
        onChange={onChange}
        onKeyPress={onKeyPress}
        layoutName={layoutName}
        layout={layout}
        theme={`hg-theme-default ${dark ? 'dark' : 'light'} animate`}
        display={{
          '{bksp}': '⌫',
          '{enter}': '⏎',
          '{shift}': '⇧',
          '{lock}': '⇪',
          '{tab}': '⇥',
          '{space}': ' ',
          '{esc}': '⎋',
        }}
      />
    </div>
  );
}

export default memo(Keyboard);
