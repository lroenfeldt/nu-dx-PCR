import { useState, useEffect } from "react";
import nuDiagnostics from "../assets/Logos/nu-diagnostics/nu-diagnostics white.png";
import { useData, useTranslation } from "../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { FaServer, FaCircle } from "react-icons/fa";
import { TbMinusVertical } from "react-icons/tb";
import moment from "moment";
import "moment/dist/locale/de";
import "moment/dist/locale/fr";
import "moment/dist/locale/en-gb";

const Footer = () => {
  const { settings, dbConnection } = useData();
  const navigate = useNavigate();
  const { locale } = useTranslation();
  const location = useLocation();
  const [stateTime, setStateTime] = useState(
    moment().locale(locale).format("LL") +
      " " +
      moment().locale(locale).format("hh:mm:ss")
  );

  const logo =
    location.pathname === "/selectMethod" ? (
      <div onDoubleClick={() => navigate("/debug")}>
        <img src={nuDiagnostics} alt="" />
      </div>
    ) : (
      <span>{settings.account.data.name || "Procomcure Biotech"}</span>
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setStateTime(
        moment().locale(locale).format("LL") +
          " " +
          moment().locale(locale).format("hh:mm:ss")
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [stateTime]);

  return (
    <div className="Footer">
      <div className="menu-left">{logo}</div>
      <div className="menu-center">
        <span></span>
      </div>
      <div className="menu-right">
        {locale === "de" ? (
          <span className="state-time-de">{stateTime}</span>
        ) : (
          ""
        )}
        {locale === "en" ? (
          <div className="state-time-en">
            <div>{stateTime}</div>
            <div>PM</div>
          </div>
        ) : (
          ""
        )}
        {locale === "fr" ? (
          <span className="state-time-fr">{stateTime}</span>
        ) : (
          ""
        )}
        <div>
          <TbMinusVertical color="#fff" size={40} />
        </div>
        <div>
          <FaServer color="#fff" />
        </div>
        <div>
          <FaCircle color={dbConnection ? "green" : "red"} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
