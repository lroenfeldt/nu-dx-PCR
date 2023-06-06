import React from 'react';
import { useData, useSticky } from '../../hooks';
import './css/table.css';

function Table({ th, tr }) {
  const { settings, selectedMethod } = useData();
  const testMethod = settings.account.testprocedures.find((procedure) => procedure.id === selectedMethod);

  // Remove the last header if showCurves is false
  if (!testMethod.showCurves) th.pop();

  // Initialize the sticky header
  useSticky({ top: 70, id: 'stickyHeader', stickyClass: 'table' });

  return (
    <div style={{ overflow: 'auto', padding: 20 }} className="table">
      <div id="stickyHeader" className="header">
        {th
          .filter((item) => item !== false)
          .filter((item) => typeof item !== undefined)
          .map((item, i) => (
            <div key={`th-${i}`} className="th">
              {item}
            </div>
          ))}
      </div>
      {tr
        .filter((item) => item !== false)
        .filter((item) => typeof item !== undefined)
        .map((element, index) => {
          // Remove the last element in the row if showCurves is false
          if (!testMethod.showCurves) element.pop();

          return (
            <div className={`tr ${index % 2 === 0 ? 'even' : 'odd'}`} key={`tr-${index}`}>
              {element
                .filter((item) => item !== false)
                .filter((item) => typeof item !== undefined)
                .map((item, i) => (
                  <div key={`row-${index}-${i}`} className="row">
                    {item ? item : '-'}
                  </div>
                ))}
            </div>
          );
        })}
    </div>
  );
}

export default Table;
