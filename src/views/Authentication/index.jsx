import LotDoku from './LotDoku';
import InputContainer from './InputContainer';
import { useNavigate } from 'react-router-dom';
import { Block, Keyboard } from '../../components';
import { useData, useTranslation } from '../../hooks';
import React, { useState, useRef, useEffect, useCallback } from 'react';

function Authentication() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const textInput = useRef(null);
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [signal, setSignal] = useState(false);
  const { settings, currentUser, setCurrentUser, selectedMethod } = useData();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [clear, setClear] = useState(false);
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

      const user = settings.account.users.find((user) => user.id == value);
      const isCertified = user?.certifiedTestprocedureIds?.includes(selectedMethod);

      setCurrentUser(user);
      if (user) {
        setKeyboardVisible(false);
        setIsValid(true);
      } else {
        setIsValid(false);
        setKeyboardVisible(false);
      }
      if (user && isCertified) {
        setIsUser(true);
        setKeyboardVisible(false);
      } else {
        setIsUser(false);
      }
      if (user && !isCertified) {
        setIsUser(true);
        setIsValid(false);
        setKeyboardVisible(false);
      }
    },
    [settings, selectedMethod, setCurrentUser]
  );
  const onKeyPress = (value) => {
    setPassword(value);
    setSignal(value.length > 0);

    const user = settings.account.users.find((user) => user.id == value);
    const isCertified = user?.certifiedTestprocedureIds?.includes(selectedMethod);
    setCurrentUser(user);
    if (user) {
      setKeyboardVisible(false);
      setIsValid(true);
    } else {
      setIsValid(false);
      setKeyboardVisible(false);
    }
    if (user && isCertified) {
      setIsUser(true);
      setKeyboardVisible(false);
    } else {
      setIsUser(false);
      setKeyboardVisible(true);
    }
    if (user && !isCertified) {
      setIsUser(true);
      setIsValid(false);
      setKeyboardVisible(false);
    }
  };

  return (
    <Block height={400} column center padding={10} gap={20}>
      <h3 style={{ textAlign: 'center' }}>{t('authentication.instructions')}</h3>
      <Block column margin="0 325px" align="center" gap={30}>
        <InputContainer
          t={t}
          signal={signal}
          isUser={isUser}
          isValid={isValid}
          password={password}
          setClear={setClear}
          textInput={textInput}
          setPassword={setPassword}
          currentUser={currentUser}
          handleChange={handleChange}
          handleKeyPress={handleKeyPress}
          keyboardVisible={keyboardVisible}
          setKeyboardVisible={setKeyboardVisible}
        />
        <Keyboard
          onChange={onKeyPress}
          visible={keyboardVisible}
          setVisible={setKeyboardVisible}
          style={{
            height: keyboardVisible && isValid ? '70%' : '83%',
          }}
          clear={clear}
          setClear={setClear}
          inputValue={'password'}
        />
        {settings.account.askForLot && isValid && (
          <LotDoku keyboardVisible={keyboardVisible} setKeyboardVisible={setKeyboardVisible} setClear={setClear} />
        )}
      </Block>
      <div className="buttonArea">
        <button onClick={() => navigate('/selectMethod')}>{t('common.cancel')}</button>
        <button className={!isValid || !isUser ? 'disabled' : ''} onClick={() => navigate('/enterBarcodes')}>
          {t('common.continue')}
        </button>
      </div>
    </Block>
  );
}

export default Authentication;
