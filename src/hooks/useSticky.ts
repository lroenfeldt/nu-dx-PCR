import { useEffect, useCallback, useState } from 'react';
import { IUseStick } from '../types/interfaces/interfaces';

const useSticky = ({ top, id, stickyClass }: IUseStick) => {
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.scrollY > top) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, [top]);

  useEffect(() => {
    if (stickyClass) {
      let body = document.getElementsByClassName(stickyClass)[0];
      body.addEventListener('scroll', () => {
        const stickyElement = document.getElementById(id);
        if (stickyElement !== null) {
          body.scrollTop > top ? stickyElement.classList.add('sticky') : stickyElement.classList.remove('sticky');
        }
      });
      return () => {
        body.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
};

export default useSticky;
