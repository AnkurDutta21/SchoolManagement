import React, { useState, useEffect } from "react";
import { AgChartsReact } from "ag-charts-react";

const BarChart = ({ salary, fees, isYearly }) => {
  const calculateProfit = (salary, fees) => {
    return fees - salary;
  };

  const [options, setOptions] = useState({
    title: {
      text: "Profit Analysis",
    },
    subtitle: {
      text: "In Rupees",
    },
    data: [],
    series: [
      {
        type: "bar",
        xKey: "quarter",
        yKey: "SalaryofTeachers",
        yName: "Salary of Teachers",
        fill: "#7cb5ec", 
      },
      {
        type: "bar",
        xKey: "quarter",
        yKey: "FeesReceived",
        yName: "Fees Received",
        fill: "#434348", 
      },
      {
        type: "bar",
        xKey: "quarter",
        yKey: "ProfitEarned",
        yName: "Profit Earned",
      },
    ],
  });

  useEffect(() => {
    const calculatedSalary = isYearly ? salary * 12 : salary;
    const calculatedFees = isYearly ? fees * 12 : fees;
    const profit = calculateProfit(calculatedSalary, calculatedFees);

    const newOptions = {
      ...options,
      data: [
        {
          quarter: "Total",
          SalaryofTeachers: calculatedSalary,
          FeesReceived: calculatedFees,
          ProfitEarned: profit,
        },
      ],
      series: options.series.map((series) => {
        if (series.yKey === "ProfitEarned") {
          return {
            ...series,
            yName: profit >= 0 ? "Profit Earned" : "Loss Incurred",
            fill: profit >= 0 ? "green" : "red",
          };
        }
        return series;
      }),
    };

    console.log("Chart Options: ", newOptions);
    setOptions(newOptions);
  }, [salary, fees, isYearly]);

  return <AgChartsReact options={options} />;
};

export default BarChart;
