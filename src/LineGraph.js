import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchdata = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchdata();
  }, [casesType]);

  const getColor = (casesType) => {
    let color = "#CC1034";
    if (casesType === "cases") {
      color = "#ffcc00";
    } else if (casesType === "recovered") {
      color = "greenyellow";
    }
    return color;
  };
  const getBackGroudColor = (casesType) => {
    let color = "rgba(204,16,52,0.2";
    if (casesType === "cases") {
      color = "rgb(255, 230, 128)";
    } else if (casesType === "recovered") {
      color = "rgb(224, 255, 179";
    }
    return color;
  };
  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: getBackGroudColor(casesType),
                borderColor: getColor(casesType),
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
