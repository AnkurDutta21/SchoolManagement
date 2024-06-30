import React, { useEffect, useState } from "react";
import { AgChartsReact } from "ag-charts-react";

export const PieChart = ({ male = 0, female = 0 }) => {
  const [options, setOptions] = useState({
    data: [
      { asset: "Male", amount: male },
      { asset: "Female", amount: female },
    ],
    title: {
      text: "Gender",
      fontSize: 18,
      fontWeight: 'bold',
    },
    series: [
      {
        type: 'pie',
        angleKey: 'amount',
        calloutLabelKey: 'asset',
        sectorLabelKey: 'amount',
        sectorLabel: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 14,
        },
        fills: ['#4CAF50', '#FF4081'], 
        strokes: ['#2E7D32', '#C2185B'],
        strokeWidth: 2,
        shadow: {
          enabled: true,
          xOffset: 3,
          yOffset: 3,
          blur: 5,
          color: 'rgba(0,0,0,0.5)',
        },
        calloutLine: {
          length: 10,
          strokeWidth: 2,
          colors: ['#4CAF50', '#FF4081'],
        },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
      markerShape: 'circle',
      fontSize: 14,
    },
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      data: [
        { asset: "Male", amount: male },
        { asset: "Female", amount: female },
      ],
    }));
  }, [male, female]);

  return <div style={{ height: "400px" }}><AgChartsReact options={options} /></div>;
};
