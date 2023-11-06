import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartValue {
  name: string;
  value: number;
}

export const LineChartRemovedGap = () => {
  const generateRecentTime = (length = 10) => {
    const times = new Array(length).fill(Date.now());

    return times
      .map((t, i) => {
        return t - i * 5000;
      })
      .reverse();
  };
  const [labels, setLabels] = useState(generateRecentTime());

  const getRandomValue = () => faker.number.int({ min: -1000, max: 1000 });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Removed fake gap",
      },
    },
    parsing: {
      xAxisKey: "name",
      yAxisKey: "value",
    },
  };

  const color = ["red", "blue", "green", "black"];

  const [serializedDataSet, setSerializedDataSet] = useState<Array<ChartValue>>(
    generateRecentTime().map((time) => {
      return {
        name: moment(time).format("mm:ss"),
        value: getRandomValue(),
      };
    })
  );

  const [fakeSet, setFakeSet] = useState<Array<ChartValue>>([]);

  const data = {
    // labels: labels.map((l) => moment(l).format("mm:ss")),
    // datasets: [
    //   {
    //     label: "Dataset 1",
    //     data: firstDataSet,
    //     borderColor: "rgb(255, 99, 132)",
    //     backgroundColor: "rgba(255, 99, 132, 0.5)",
    //   },
    //   {
    //     label: "Dataset 2",
    //     data: secondDataSet,
    //     borderColor: "rgb(53, 162, 235)",
    //     backgroundColor: "rgba(53, 162, 235, 0.5)",
    //   },
    // ],
    datasets: [
      {
        label: "Real usage",
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        color: "#666",
        data: serializedDataSet,
      },
      {
        label: "Predicted usage",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: [[...serializedDataSet].pop(), ...fakeSet],
        borderDash: [5],
      },
    ],
  };

  useEffect(() => {
    let interval = setInterval(() => {
      const newData = {
        name: moment(Date.now()).format("mm:ss"),
        value: getRandomValue(),
      };

      if (fakeSet.length === 3) {
        setFakeSet([]);
        setSerializedDataSet((prev) => {
          return [...prev, newData];
        });
      } else {
        setFakeSet((prev) => {
          const clone = [...prev];

          return [
            ...prev,
            {
              name: newData.name,
              value: clone.length
                ? clone.pop().value
                : [...serializedDataSet].pop().value,
            },
          ];
        });
        // setSerializedDataSet((prev) => {
        //   return [...prev, null];
        // });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fakeSet, serializedDataSet]);

  const handeAddNewPoint = () => {
    const newData = {
      name: moment(Date.now()).format("mm:ss"),
      value: getRandomValue(),
    };

    setFakeSet([]);
    setSerializedDataSet((prev) => {
      return [...prev, newData];
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "50vw",
          height: "100%",
        }}
      >
        <Line options={options} data={data} />
      </div>
      <button
        style={{
          backgroundColor: "blue",
          color: "white",
          borderRadius: 4,
          padding: 4,
          width: 100,
        }}
        onClick={handeAddNewPoint}
      >
        Add value
      </button>
    </div>
  );
};
