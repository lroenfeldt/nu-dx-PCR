import React from 'react';
import { FcOk, FcCancel } from 'react-icons/fc';
import { ActivateKeyboard, ArrowBox } from '../../components/';

const InputContainer = ({
  t,
  signal,
  isUser,
  isValid,
  password,
  textInput,
  currentUser,
  handleChange,
  handleKeyPress,
  keyboardVisible,
  setKeyboardVisible,
}) => {
  return (
    <div className="inputContainer" style={{ marginBottom: 0 }}>
      <form action="" onSubmit={(e) => console.log(e)}>
        <div
          style={{
            maxHeight: 40,
            display: 'flex',
            flexDirection: 'row',
            transition: 'all 0.5s ease',
            marginBottom: isValid && keyboardVisible ? -337 : keyboardVisible ? -200 : 0,
          }}
        >
          <ActivateKeyboard
            onClick={() => {
              setKeyboardVisible(!keyboardVisible);
              textInput.current.focus();
            }}
          />
          <input
            ref={textInput}
            autoFocus
            type="text"
            value={password}
            placeholder={'237c97x2'}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          />
          {signal && (
            <ArrowBox
              direction={`right ${signal ? 'active' : ''}`}
              style={{
                right: keyboardVisible ? 40 : 20,
                width: 400,
                zIndex: 100,
                minWidth: 400,
                position: 'absolute',
                transition: 'all 0.5s ease 0s',
                top: isValid && keyboardVisible ? '68%' : keyboardVisible ? '69%' : isValid ? '28%' : '44%',
              }}
            >
              {isUser ? (
                <div
                  style={{
                    maxWidth: 500,
                    minHeight: 100,
                    textAlign: 'justify',
                  }}
                >
                  <div>
                    <strong>{currentUser?.name}</strong>
                    <br />
                    <span style={{ fontSize: 16 }}>{currentUser?.email}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'start',
                      alignItems: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {isValid ? (
                      <>
                        <FcOk size={40} />
                        <h5>{t('common.certified')}</h5>
                      </>
                    ) : (
                      <>
                        <FcCancel size={40} />
                        <h5>{t('common.notCertified')}</h5>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', maxWidth: 500, minHeight: 100 }}>
                  <p style={{ color: '#D44444' }}>{t('authentication.invalid')}</p>
                </div>
              )}
            </ArrowBox>
          )}
        </div>
      </form>
    </div>
  );
};

export default InputContainer;
