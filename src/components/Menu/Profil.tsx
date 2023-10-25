import React, { useCallback } from "react";
import { Block, Button, Input, Logout, Text } from "..";
import { useData, useTranslation, useTheme } from "../../hooks";
import { useNavigate } from "react-router-dom";
import Label from "../Label";

interface LanguageButtonProps {
  locale: string;
  value: string;
  handleLocale: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const LanguageButton: React.FC<LanguageButtonProps> = ({
  locale,
  value,
  handleLocale,
}) => {
  const { colors } = useTheme();
  return (
    <Label
      flex
      row
      align="center"
      gap={16}
      padding={"16px 32px"}
      border={`3px solid ${colors.secondary.main}`}
      radius={8}
      width={198}
      cursor="pointer"
      htmlFor="lang"
    >
      <Input
        id="language"
        type="radio"
        value={value}
        name="lang"
        width={20}
        height={20}
        onChange={handleLocale}
        checked={locale === value}
        style={{ cursor: "pointer" }}
      />
      <Text p>{value.charAt(0).toUpperCase() + value.slice(1)}</Text>
    </Label>
  );
};

const Profil = () => {
  const { clearSettings, settings, saveSettings } = useData();
  const { locale, setLocale, t } = useTranslation();
  const navigate = useNavigate();
  const handleLocale = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLocale = e.target.value;
      setLocale(newLocale);
      const newSettings = {
        ...settings,
        user: { ...settings.user, locale: newLocale },
      };
      await saveSettings(newSettings);
    },
    [locale, setLocale, settings, saveSettings]
  );
  const resetDevice = async () => {
    await clearSettings();
    window.api.logEvents(`Settings loaded: ${JSON.stringify(settings)}`);
    navigate("/");
  };
  const languages = ["de", "en", "fr"];

  return (
    <>
      <Block
        flex
        column
        align="flex-start"
        justify="flex-start"
        gap={44}
        width={436}
       
      >
        <Block flex column align="flex-start" justify="flex-start" gap={16} >
          <Text h3>Profil </Text>
          <Text p>{settings.account.data.name} </Text>
          <Text p>{settings.account.data.email} </Text>
          <Button
            secondary
            row
            flex
            padding={"14px 32px"}
            gap={16}
            onClick={resetDevice}
          >
            <Logout />
            <Text p label>
              {t("common.logout")}
            </Text>
          </Button>
        </Block>
        <Block
          flex
          column
          align="flex-start"
          height={192}
          justify="flex-start"
          gap={24}
          alignSelf="stretch"
        >
          <Text h4>{t("common.language")}</Text>
          {languages.map((lang) => (
            <LanguageButton
              key={lang}
              locale={locale}
              value={lang}
              handleLocale={handleLocale}
            />
          ))}
        </Block>
      </Block>
    </>
  );
};

export default Profil;
