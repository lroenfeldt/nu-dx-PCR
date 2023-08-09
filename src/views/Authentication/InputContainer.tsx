import { memo, useRef } from 'react';
import { FcOk, FcCancel } from 'react-icons/fc';
import { IoCloseCircle } from 'react-icons/io5';
import { ActivateKeyboard, ArrowBox, Block } from '../../components';
import { IInputContainer, ITextInput } from '../../types/interfaces/interfaces';

const InputContainer = ({
  t,
  signal,
  isUser,
  isValid,
  password,
  setClear,
  setPassword,
  currentUser,
  handlePasswordChange,
  handleKeyPress,
  keyboardVisible,
  setKeyboardVisible,
  setIsChargenNrFocused,
  isChargenNrFocused,
  inputName,
  setInputName,
  getInputValue,
  setInputs,
  inputs,
}: IInputContainer) => {
  const textInput: ITextInput = useRef(null) as ITextInput;
  return (
    <div className="inputContainer" style={{ marginBottom: 0 }}>
      <form action="" onSubmit={(e) => console.log(e)}>
        <Block
          align={'center'}
          children={
            <>
              <label htmlFor="UserID">UserID</label>
              <ActivateKeyboard
                onClick={() => {
                  setKeyboardVisible(!keyboardVisible);
                  textInput?.current?.setSelectionRange(textInput.current.value.length, textInput.current.value.length);
                  textInput.current.focus();
                }}
              />
              <input
                id="UserID"
                ref={textInput}
                autoFocus
                type="text"
                name="UserID"
                value={getInputValue('UserID')}
                onChange={handlePasswordChange}
                placeholder={'237c97x2'}
                onKeyDown={handleKeyPress}
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                onFocus={() => {
                  setInputName('UserID');
                  setIsChargenNrFocused(false);
                }}
              />
              <IoCloseCircle
                onClick={() => {
                  setPassword('');
                  setInputs((inputs: {}) => ({ ...inputs, UserID: '' }));

                  textInput.current.focus();
                  setClear(true);
                }}
                style={{
                  top: 5,
                  zIndex: 100,
                  fontSize: 30,
                  cursor: 'pointer',
                  position: 'absolute',
                  transition: 'var(--transition)',
                  right: password.length > 0 ? 4 : 0,
                  visibility: password.length > 0 ? 'visible' : 'hidden',
                }}
              />
            </>
          }
          position={'relative'}
          marginTop={isValid && keyboardVisible ? 70 : 0}
          marginBottom={isValid && keyboardVisible ? 0 : keyboardVisible ? -200 : 0}
          transition={'all 0.5s ease'}
          zIndex={1}
        />
        {signal && password.length > 0 && (
          <Block
            style={{
              position: 'absolute',
              top:
                keyboardVisible && isValid
                  ? '60%'
                  : keyboardVisible && !isValid
                  ? '72%'
                  : isValid && !keyboardVisible
                  ? '36%'
                  : isValid && keyboardVisible
                  ? '28%'
                  : '49%',
              right: '5.5%',
              width: 300,
              zIndex: 0,
              transition: 'var(--transition)',
            }}
            children={
              <>
                <ArrowBox
                  children={
                    <>
                      {isUser ? (
                        <Block
                          children={
                            <>
                              <Block
                                align={'flex-start'}
                                children={
                                  <>
                                    <strong>{currentUser?.name}</strong>
                                    <span style={{ fontSize: 16 }}>{currentUser?.email}</span>
                                  </>
                                }
                                marginTop={5}
                                column={0}
                              />

                              <Block
                                align={'center'}
                                justify={'start'}
                                children={
                                  <>
                                    {isValid ? (
                                      <>
                                        <FcOk size={30} />
                                        <h5>{t('common.certified')}</h5>
                                      </>
                                    ) : (
                                      <>
                                        <FcCancel size={30} />
                                        <h5>{t('common.notCertified')}</h5>
                                      </>
                                    )}
                                  </>
                                }
                              />
                            </>
                          }
                        />
                      ) : (
                        <Block children={<p style={{ color: '#D44444' }}>{t('authentication.invalid')}</p>} />
                      )}
                    </>
                  }
                  style={undefined}
                  direction={`left ${signal ? 'active' : ''} ${!isUser ? 'alert' : ''}`}
                />
              </>
            }
          />
        )}
      </form>
    </div>
  );
};

export default memo(InputContainer);
