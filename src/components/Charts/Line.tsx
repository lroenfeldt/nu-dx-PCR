import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line as LineChart } from "react-chartjs-2";
import { useData } from "../../hooks";
import { ITestProcedure } from "../../types/interfaces/settings";
import { ILineProps } from "../../types/components";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Line: React.FC<ILineProps> = ({ barcode }) => {
  const { selectedMethod, settings } = useData();
  const testMethod = settings.account.testprocedures.find(
    (method) => method.id === selectedMethod
  ) as ITestProcedure;

  const { parameters } = testMethod;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
      },
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          pointStyle: "line",
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
        type: "linear" as "linear",
        grid: {
          zeroLineColor: "transparent",
          drawBorder: true,
          drawTicks: true,
          drawOnChartArea: true,
        },
        ticks: {
          maxTicksLimit: 7,
        },
      },
      x: {
        type: "linear" as "linear",
        display: true,
        ticks: {
          display: true,
        },
        startAtZero: false,
      },
    },
    layout: {
      padding: { left: 0, right: 0, top: 15, bottom: 15 },
    },
  };

  let datasets = [];
  let count = 0;
  let newNum = "0.0";
  let labelsLength: number[] = [];

  for (let param in barcode.parameters) {
    let parameter = barcode.parameters[param];
    let dataset = {
      label: parameters.find((p) => p.target == param.toUpperCase())?.label,
      data: parameter.curveData, // Array of strings
      borderColor: parameters.find((p) => p.target == param.toUpperCase())
        ?.color,
      borderWidth: 3,
    };
    datasets.push(dataset);

    if (!parameter.curveData.includes(newNum)) {
      parameter.curveData.unshift(newNum);
    }

    count = parameter.curveData.length;
    let resultArray: number[] = Array.from(
      { length: count },
      (_, index) => index
    );
    labelsLength = resultArray;

    const iShowThreshhold = parameters.find(
      (p) => p.target == param.toUpperCase()
    )?.showThreshhold;
    if (iShowThreshhold) {
      datasets.push({
        label:
          parameters.find((p) => p.target == param.toUpperCase())?.label +
          "Threshhold",
        data: new Array(labelsLength.length).fill(
          parameters.find((p) => p.target == param.toUpperCase())?.threshhold
        ),
        borderColor: parameters.find((p) => p.target == param.toUpperCase())
          ?.color,
        borderWidth: 3,
        borderDash: [5, 5],
        pointRadius: 0,
      });
    }
  }

  let labels = labelsLength;
  const data = {
    labels,
    datasets,
  };
  return <LineChart options={options} data={data} />;
};

export default Line;
