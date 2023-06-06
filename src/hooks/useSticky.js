import React, { useEffect, useCallback, useState } from 'react';

const useSticky = ({ top, id, stickyClass }) => {
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.pageYOffset > top) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, [top]);

  useEffect(() => {
    if (stickyClass) {
      let body = document.getElementsByClassName(stickyClass)[0];
      body.addEventListener('scroll', () => {
        // console.log(body.clientHeight, body.scrollHeight, body.scrollTop);
        body.scrollTop > top
          ? document.getElementById(id).classList.add('sticky')
          : document.getElementById(id).classList.remove('sticky');
      });
      return () => {
        body.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
};

export default useSticky;
