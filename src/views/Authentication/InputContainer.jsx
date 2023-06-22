import React from 'react';
import { FcOk, FcCancel } from 'react-icons/fc';
import { IoCloseCircle } from 'react-icons/io5';
import { ActivateKeyboard, ArrowBox, Block } from '../../components/';
const InputContainer = ({
  t,
  signal,
  isUser,
  isValid,
  password,
  textInput,
  setClear,
  setPassword,
  currentUser,
  handleChange,
  handleKeyPress,
  keyboardVisible,
  setKeyboardVisible,
}) => {
  return (
    <div className="inputContainer" style={{ marginBottom: 0 }}>
      <form action="" onSubmit={(e) => console.log(e)}>
        <Block
          align="center"
          position="relative"
          transition="all 0.5s ease"
          zIndex={1}
          marginBottom={isValid && keyboardVisible ? 0 : keyboardVisible ? -200 : 0}
          marginTop={isValid && keyboardVisible ? 34 : 0}
        >
          <label htmlFor="UserID">UserID</label>
          <ActivateKeyboard
            onClick={() => {
              setKeyboardVisible(!keyboardVisible);
              textInput.current.focus();
            }}
          />
          <input
            autoFocus
            id="UserID"
            type="text"
            name="UserID"
            ref={textInput}
            value={password}
            onChange={handleChange}
            placeholder={'237c97x2'}
            onKeyDown={handleKeyPress}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          />
          <IoCloseCircle
            onClick={() => {
              setPassword('');
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
        </Block>
        {signal && password.length > 0 && (
          <Block
            style={{
              position: 'absolute',
              top:
                keyboardVisible && isValid
                  ? '53%'
                  : keyboardVisible && !isValid
                  ? '66%'
                  : isValid && !keyboardVisible
                  ? '34%'
                  : isValid && keyboardVisible
                  ? '28%'
                  : '42%',
              right: 65,
              width: 300,
              height: 200,
              zIndex: 100,
              transition: 'var(--transition)',
            }}
          >
            <ArrowBox direction={`right ${signal ? 'active' : ''}`}>
              {isUser ? (
                <Block flex={0}>
                  <Block flex={0}>
                    <strong>{currentUser?.name}</strong>
                    <br />
                    <span style={{ fontSize: 16 }}>{currentUser?.email}</span>
                  </Block>
                  <Block justify="start" align="center">
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
                  </Block>
                </Block>
              ) : (
                <Block>
                  <p style={{ color: '#D44444' }}>{t('authentication.invalid')}</p>
                </Block>
              )}
            </ArrowBox>
          </Block>
        )}
      </form>
    </div>
  );
};

export default InputContainer;
