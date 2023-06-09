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
  const handleSelected = (e) => {
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    e.target.classList.add('selected');
  };

  return (
    <div style={{ overflow: 'auto', position: 'relative' }} className="table">
      <table>
        <thead id="stickyHeader" className="header">
          {th
            .filter((item) => item !== false)
            .filter((item) => typeof item !== undefined)
            .map((item, i) => (
              <th key={`th-${i}`} className="th">
                {item}
              </th>
            ))}
        </thead>
        <tbody>
          {tr
            .filter((item) => item !== false)
            .filter((item) => typeof item !== undefined)
            .map((element, index) => {
              // Remove the last element in the row if showCurves is false
              if (!testMethod.showCurves) element.pop();

              return (
                <tr className={`tr ${index % 2 === 0 ? 'even' : 'odd'}`} key={`tr-${index}`} onClick={handleSelected}>
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
    </div>
  );
}

export default Table;
