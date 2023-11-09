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
    moment().locale(locale).format("L") +
      " " +
      moment().locale(locale).format("LTS")
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
        moment().locale(locale).format("L") +
          " " +
          moment().locale(locale).format("LTS")
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
        {stateTime}
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
