import  { FC } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  
} from 'chart.js';
import { Line as LineChart } from 'react-chartjs-2';
import { useData } from '../../hooks';
import { IBarcode } from '../../types/interfaces/interfaces';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Line: FC<IBarcode> = ({ barcode }) => {
  const { selectedMethod, settings } = useData();
  const testMethod = selectedMethod 
  ? settings.account.testprocedures.find((method) => method.id === selectedMethod) 
  : undefined;

const parameters = testMethod?.parameters || [];
 
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltips: {
        bodySpacing: 4,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest',
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          pointStyle: 'line',
          borderWidth: 3,
          pointSize: 20,
        },
      },
      title: {
        display: true,
        text: barcode.value,
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        grid: {
          zeroLineColor: 'transparent',
          drawBorder: false,
        },
        ticks: {
          maxTicksLimit: 7,
        },
      },
      x: {
        display: 1,
        ticks: {
          display: true,
        },
      },
    },
    layout: {
      padding: { left: 0, right: 0, top: 15, bottom: 15 },
    },
  };
  const labels = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  ];

  let datasets= [];

  for (let param in parameters) {
    let parameter = parameters[param];
    let dataset = {
      label: parameters.find((p) => p.target == param.toUpperCase())?.label,
      data: parameter.curveData,
      borderColor: parameters.find((p) => p.target == param.toUpperCase())?.color,
      borderWidth: 3,
    };
    datasets.push(dataset);

    const iShowThreshhold = parameters.find((p) => p.target == param.toUpperCase())?.showThreshhold;
    if (iShowThreshhold) {
      datasets.push({
        label: parameters.find((p) => p.target == param.toUpperCase())?.label + ' Threshhold',
        data: new Array(40).fill(
          parameters.find((p) => p.target == param.toUpperCase())?.threshhold
        ),
        borderColor: parameters.find((p) => p.target == param.toUpperCase())?.color,
        borderWidth: 3,
        borderDash: [5, 5],
        pointRadius: 0,
      });
    }
  }

  const data = {
    labels,
    datasets,
  };
  return <LineChart options={options} data={data} />;
}

export default Line;
