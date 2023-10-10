import React, { useRef, useEffect } from 'react';
import { useData, useSticky } from '../../hooks';
import './css/table.css';

function Table({ th, tr }) {
  const { settings, selectedMethod } = useData();
  const testMethod = settings.account.testprocedures.find((procedure) => procedure.id === selectedMethod);

  // Remove the last header if showCurves is false
  if (!testMethod.showCurves) th.pop();

  // Initialize the sticky header
  useSticky({ top: 5, id: 'stickyHeader', stickyClass: 'table' });
  const handleSelected = (e) => {
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');

    e.target.classList.add('selected');
  };
  const containerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      const fadeOut = document.querySelector('.fade-out');
      // fadeOut.style.right = `${-((scrollLeft / clientWidth) * 100)}%`;
      if (scrollLeft + clientWidth >= scrollWidth) {
        containerRef.current.classList.add('end-reached');
      } else {
        containerRef.current.classList.remove('end-reached');
      }
      if (scrollLeft === 0) {
        containerRef.current.classList.add('start-reached');
      } else {
        containerRef.current.classList.remove('start-reached');
      }
    };
    handleScroll();
    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      if (containerRef.current) containerRef.current.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="table" ref={containerRef}>
      <table>
        <thead id="stickyHeader" className="header">
          <tr>
            {th
              .filter((item) => item !== false)
              .filter((item) => typeof item !== undefined)
              .map((item, i) => (
                <th key={`th-${i}`} className="th">
                  {item}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tr
            .filter((item) => item !== false)
            .filter((item) => typeof item !== undefined)
            .map((element, index) => {
              // Remove the last element in the row if showCurves is false
              if (!testMethod.showCurves) element.pop();

              return (
                <tr key={`tr-${index}`} data-animate>
                  {element
                    .filter((item) => item !== false)
                    .filter((item) => typeof item !== undefined)
                    .map((item, i) => (
                      <td key={`row-${index}-${i}`} className="row">
                        {item ? item : '-'}
                      </td>
                    ))}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="fade-out"></div>
      <div className="fade-out-left"></div>
    </div>
  );
}

export default Table;
