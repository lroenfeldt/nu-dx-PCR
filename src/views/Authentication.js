import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcOk, FcCancel } from 'react-icons/fc';
import { useData, useTranslation } from '../hooks';
import ArrowBox from '../components/ArrowBox/ArrowBox';
import { Block, Keyboard, ActivateKeyboard } from '../components';
import { vi } from 'date-fns/locale';

function Authentication() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const textInput = useRef(null);
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [signal, setSignal] = useState(false);
  const { settings, currentUser, setCurrentUser, selectedMethod } = useData();
  const [visible, setVisible] = useState(false);
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && isValid) {
      navigate('/enterBarcodes');
    }
  };

  const handleChange = useCallback(
    (e) => {
      const { value } = e.target;

      setPassword(value);
      setSignal(value.length > 0);
      console.log(value);
      const user = settings.account.users.find((user) => user.id == value);
      const isCertified = user?.certifiedTestprocedureIds?.includes(selectedMethod);
      console.log(user, isCertified, selectedMethod);
      setCurrentUser(user);
      if (user) {
        setVisible(false);
        setIsValid(true);
      } else {
        setIsValid(false);
        setVisible(false);
      }
      if (user && isCertified) {
        setIsUser(true);
        setVisible(false);
      } else {
        setIsUser(false);
        setVisible(true);
      }
      if (user && !isCertified) {
        setIsUser(true);
        setIsValid(false);
        setVisible(false);
      }
    },
    [settings, selectedMethod, setCurrentUser]
  );
  const onKeyPress = (value) => {
    setPassword(value);
    setSignal(value.length > 0);
    console.log(value);
    const user = settings.account.users.find((user) => user.id == value);
    const isCertified = user?.certifiedTestprocedureIds?.includes(selectedMethod);
    console.log(user, isCertified, selectedMethod);
    setCurrentUser(user);
    if (user) {
      setVisible(false);
      setIsValid(true);
    } else {
      setIsValid(false);
      setVisible(false);
    }
    if (user && isCertified) {
      setIsUser(true);
      setVisible(false);
    } else {
      setIsUser(false);
      setVisible(true);
    }
    if (user && !isCertified) {
      setIsUser(true);
      setIsValid(false);
      setVisible(false);
    }
  };

  return (
    <Block height={400} column center padding={10} gap={20}>
      <h3 style={{ textAlign: 'center', marginTop: '10%' }}>{t('default.authentication.instructions')}</h3>
      <div className="inputContainer">
        <form action="" onSubmit={(e) => console.log(e)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              transition: 'all 0.5s ease',
              marginBottom: !visible ? 0 : -170,
              maxHeight: 40,
            }}
          >
            <ActivateKeyboard
              onClick={() => {
                setVisible(!visible);
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
                  right: 40,
                  width: 400,
                  zIndex: 100,
                  minWidth: 400,
                  position: 'absolute',
                  top: visible ? '69%' : '48%',
                  transition: 'all 0.5s ease 0s',
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
                          <h5>{t('default.common.certified')}</h5>
                        </>
                      ) : (
                        <>
                          <FcCancel size={40} />
                          <h5>{t('default.common.notCertified')}</h5>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', maxWidth: 500, minHeight: 100 }}>
                    <p style={{ color: '#D44444' }}>{t('default.authentication.invalid')}</p>
                  </div>
                )}
              </ArrowBox>
            )}
          </div>
        </form>
      </div>
      <Keyboard
        visible={visible}
        setVisible={setVisible}
        onChange={onKeyPress}
        style={{
          height: '83%',
        }}
      />
      <div className="buttonArea">
        <button onClick={() => navigate('/selectMethod')}>{t('default.common.cancel')}</button>
        <button className={!isValid || !isUser ? 'disabled' : ''} onClick={() => navigate('/enterBarcodes')}>
          {t('default.common.continue')}
        </button>
      </div>
    </Block>
  );
}

export default Authentication;
