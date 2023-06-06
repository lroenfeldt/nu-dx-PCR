import React, { useCallback, useEffect, useState } from 'react';
import './dropdown.css';
import { useData, useTranslation } from '../../hooks';
const Dropdown = ({ children, onChange, selected }) => {
  const { settings, saveSettings, setSettings } = useData();
  const { locale } = useTranslation();
  useEffect(() => {
    let dropdown = document.querySelector('.dropdown');
    let option = document.querySelector('.option');

    for (const child of option.children) {
      if (locale == 'en' && child.innerHTML.includes('English'))
        document.querySelector('.textBox').innerHTML = child.innerHTML;
      if (locale == 'fr' && child.innerHTML.includes('Français'))
        document.querySelector('.textBox').innerHTML = child.innerHTML;
      if (locale == 'de' && child.innerHTML.includes('Deutsch'))
        document.querySelector('.textBox').innerHTML = child.innerHTML;

      child.addEventListener('click', (e) => {
        for (const k of option.children) k.classList.remove('selected');
        e.target.classList.add('selected');
        document.querySelector('.textBox').innerHTML = e.target.innerHTML;
      });
    }

    dropdown.onclick = function () {
      dropdown.classList.toggle('active');
    };

    //document.querySelector(".textBox").innerHTML = settings.user.dropDownPlaceholder ? settings.user.dropDownPlaceholder : option.children[0].innerHTML;

    window.onclick = function (event) {
      if (event.target !== document.querySelector('.textBox')) {
        dropdown.classList.remove('active');
      }
    };
  }, [locale]);

  return (
    <div id="dropdown" className="dropdown">
      <div className="textBox"></div>
      <div className="option">{children}</div>
    </div>
  );
};

export default Dropdown;
