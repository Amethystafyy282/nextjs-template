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

export const LineChart = () => {
  const generateRecentTime = (length = 10) => {
    const times = new Array(length).fill(Date.now());

    return times
      .map((t, i) => {
        return t - i * 5000;
      })
      .reverse();
  };
  const [labels, setLabels] = useState(generateRecentTime());

  const getRandomValue = () => faker.number.int({ min: 0, max: 1000 });

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Default",
      },
    },
    parsing: {
      xAxisKey: "name",
      yAxisKey: "value",
    },
  };

  const color = ["red", "blue", "green", "black"];

  const [receiveDataSet, setReceiveDataSet] = useState<Array<ChartValue>>(
    generateRecentTime(20).map((time) => {
      return {
        name: moment(time).format("mm:ss"),
        value: getRandomValue(),
      };
    })
  );

  const [sentDataSet, setSentDataSet] = useState<Array<ChartValue>>(
    generateRecentTime(20).map((time) => {
      return {
        name: moment(time).format("mm:ss"),
        value: getRandomValue(),
      };
    })
  );

  const [fakeReceiveDataSet, setFakeReceiveDataSet] = useState<
    Array<ChartValue>
  >([]);
  const [fakeSentDataSet, setFakeSentDataSet] = useState<Array<ChartValue>>([]);

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
        label: "Kilobytes received",
        backgroundColor: "#FFF",
        borderColor: "#DD9200",
        data: receiveDataSet,
      },
      {
        label: "Predicted Kilobytes received",
        backgroundColor: "#FFF",
        borderColor: "#DD9200",
        data: [[...receiveDataSet].pop(), ...fakeReceiveDataSet],
        borderDash: [5],
      },
      {
        label: "Kilobytes sent",
        backgroundColor: "#FFF",
        borderColor: "#666666",
        data: sentDataSet,
      },
      {
        label: "Predicted Kilobytes sent",
        backgroundColor: "#FFF",
        borderColor: "#666666",
        data: [[...sentDataSet].pop(), ...fakeSentDataSet],
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

      if (fakeReceiveDataSet.length === 3) {
        setFakeReceiveDataSet([]);
        setReceiveDataSet((prev) => {
          return [...prev, newData];
        });
      } else {
        setFakeReceiveDataSet((prev) => {
          const clone = [...prev];

          return [
            ...prev,
            {
              name: newData.name,
              value: clone.length
                ? clone.pop().value
                : [...receiveDataSet].pop().value,
            },
          ];
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fakeReceiveDataSet, receiveDataSet]);

  useEffect(() => {
    let interval = setInterval(() => {
      const newData = {
        name: moment(Date.now()).format("mm:ss"),
        value: getRandomValue(),
      };

      if (fakeSentDataSet.length === 3) {
        setFakeSentDataSet([]);
        setSentDataSet((prev) => {
          return [...prev, newData];
        });
      } else {
        setFakeSentDataSet((prev) => {
          const clone = [...prev];

          return [
            ...prev,
            {
              name: newData.name,
              value: clone.length
                ? clone.pop().value
                : [...sentDataSet].pop().value,
            },
          ];
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fakeSentDataSet, sentDataSet]);

  const handleAddPoint = () => {
    setFakeSentDataSet([]);
    setSentDataSet((prev) => {
      return [
        ...prev,
        {
          name: moment(Date.now()).format("mm:ss"),
          value: getRandomValue(),
        },
      ];
    });

    setFakeReceiveDataSet([]);
    setReceiveDataSet((prev) => {
      return [
        ...prev,
        {
          name: moment(Date.now()).format("mm:ss"),
          value: getRandomValue(),
        },
      ];
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
          width: "80vw",
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
        onClick={handleAddPoint}
      >
        Add point
      </button>
    </div>
  );
};
