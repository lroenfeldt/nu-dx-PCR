import LotDoku from './LotDoku';
import InputContainer from './InputContainer';
import { useNavigate } from 'react-router-dom';
import { Block, Keyboard } from '../../components';
import { useData, useTranslation } from '../../hooks';
import { useState, useCallback, memo } from 'react';

function Authentication() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [signal, setSignal] = useState(false);
  const { settings, currentUser, setCurrentUser, selectedMethod, setLotNumber, lotNumber } = useData();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isChargenNrFocused, setIsChargenNrFocused] = useState(false);
  const [clear, setClear] = useState(false);
  const [inputs, setInputs] = useState({});
  const [inputName, setInputName] = useState('default');

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter' && isValid) {
      navigate('/enterBarcodes');
    }
  };

  const handlePasswordChange = useCallback(
    (e: { target: { value: string } }) => {
      const { value } = e.target;
      setInputs((inputs) => ({ ...inputs, [inputName]: value }));
      setPassword(value);
      setSignal(value.length > 0);

      const user = settings.account.users.find((user) => user.id == value);
      const isCertified = user?.certifiedTestprocedureIds?.includes(selectedMethod.toString());

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
        setIsChargenNrFocused(true);
      } else {
        setIsUser(false);
        setIsChargenNrFocused(false);
      }
      if (user && !isCertified) {
        setIsUser(true);
        setIsValid(false);
        setKeyboardVisible(false);
      }
    },
    [settings, selectedMethod, setCurrentUser]
  );

  const onKeyPress = useCallback(
    (value: string) => {
      setInputs((inputs) => ({ ...inputs, [inputName]: value }));
      if (isChargenNrFocused) {
        setLotNumber(value);
      } else {
        setPassword(value);
      }
      setSignal(value.length > 0);

      const user = settings.account.users.find((user) => user.id == value);
      const isCertified = user?.certifiedTestprocedureIds?.includes(selectedMethod.toString()); // converted to string
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
    },
    [settings, selectedMethod, setCurrentUser, isChargenNrFocused, inputName, setLotNumber]
  );

  const getInputValue = (inputName: string) => {
    return inputs[inputName as keyof typeof inputs] || '';
  };
  // Error message because of trying to index an object (`inputs`) using the `inputName` variable,
  // but TypeScript doesn't have enough information to determine
  // if the property exists on the object.
  // To fix issue, use the `as` keyword to assert the type of the object.
  // The `as` keyword to assert that `inputName` should be a key of the `inputs` object.

  return (
    <>
      <Block
        height={400}
        padding={10}
        children={
          <>
            <h3 style={{ textAlign: 'center' }}>
              {settings.account.hasUserAuthentification && !isValid
                ? t('authentication.instructions')
                : t('authentication.currentLot')}
            </h3>

            <Block
              align={'center'}
              margin={'0 325px'}
              children={
                <>
                  {settings.account.hasUserAuthentification && (
                    <InputContainer
                      t={t}
                      signal={signal}
                      isUser={isUser}
                      isValid={isValid}
                      password={password}
                      setClear={setClear}
                      inputName={inputName}
                      setPassword={setPassword}
                      currentUser={currentUser}
                      handlePasswordChange={handlePasswordChange}
                      setInputName={setInputName}
                      handleKeyPress={handleKeyPress}
                      keyboardVisible={keyboardVisible}
                      setKeyboardVisible={setKeyboardVisible}
                      isChargenNrFocused={isChargenNrFocused}
                      setIsChargenNrFocused={setIsChargenNrFocused}
                      getInputValue={getInputValue}
                      setInputs={setInputs}
                      inputs={inputs}
                    />
                  )}
                  <Keyboard
                    clear={clear}
                    inputs={inputs}
                    setClear={setClear}
                    inputName={inputName}
                    setInputs={setInputs}
                    visible={keyboardVisible}
                    setVisible={setKeyboardVisible}
                    inputValue={isChargenNrFocused ? lotNumber : password}
                    onChange={isChargenNrFocused ? setLotNumber : onKeyPress}
                    style={{
                      height: keyboardVisible && isValid ? '70%' : '83%',
                    }}
                    dark={false}
                  />
                  {((settings.account.askForLot && isValid) ||
                    (settings.account.askForLot && !settings.account.hasUserAuthentification)) && (
                    <LotDoku
                      setClear={setClear}
                      inputName={inputName}
                      setInputName={setInputName}
                      keyboardVisible={keyboardVisible}
                      setKeyboardVisible={setKeyboardVisible}
                      isChargenNrFocused={isChargenNrFocused}
                      setIsChargenNrFocused={setIsChargenNrFocused}
                      inputs={undefined}
                    />
                  )}
                </>
              }
              gap={30}
            />

            <div className="buttonArea">
              <button onClick={() => navigate('/selectMethod')}>{t('common.cancel')}</button>
              <button
                className={settings.account.hasUserAuthentification && (!isValid || !isUser) ? 'disabled' : ''}
                onClick={() => navigate('/enterBarcodes')}
              >
                {t('common.continue')}
              </button>
            </div>
          </>
        }
        gap={20}
      />
    </>
  );
}

export default memo(Authentication);
