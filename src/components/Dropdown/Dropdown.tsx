import { ChangeEvent, useEffect } from 'react';
import './dropdown.css';
import { useTranslation } from '../../hooks';

interface DropdownProps {
  children: React.ReactNode;
}

const Dropdown = ({ children }: DropdownProps) => {
  const { locale }: any = useTranslation();

  useEffect(() => {
    let dropdown = document.querySelector('.dropdown') as HTMLDivElement;
    let option = document.querySelector('.option') as HTMLDivElement;

    for (const child of option.children as any) {
      if (locale === 'en' && child.props.children.includes('English'))
        (document.querySelector('.textBox') as HTMLDivElement).innerHTML = child.props.children;
      if (locale === 'fr' && child.props.children.includes('Français'))
        (document.querySelector('.textBox') as HTMLDivElement).innerHTML = child.props.children;
      if (locale === 'de' && child.props.children.includes('Deutsch'))
        (document.querySelector('.textBox') as HTMLDivElement).innerHTML = child.props.children;

      child.addEventListener('click', (e: ChangeEvent<HTMLSelectElement>) => {
        for (const k of option.children as any) k.classList.remove('selected');
        e.target.classList.add('selected');
        (document.querySelector('.textBox') as HTMLDivElement).innerHTML = e.target.innerHTML;
      });
    }

    dropdown.onclick = function () {
      dropdown.classList.toggle('active');
    };

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
