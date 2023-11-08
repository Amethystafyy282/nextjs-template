import React, { useEffect, useMemo, useState } from "react";
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
  TimeScale,
  ChartOptions,
} from "chart.js";
import { CoreScaleOptions, Scale } from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-moment";
import moment from "moment";

ChartJS.register(
  annotationPlugin,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ChartValue {
  name: Date;
  value: number;
}

export const LineChartRemovedGap = () => {
  const generateRecentTime = (length = 10) => {
    const times = new Array(length).fill(Date.now());

    return times
      .map((t, i) => {
        return t - i * 50000;
      })
      .reverse();
  };
  const getRandomValue = () => faker.number.int({ min: 0, max: 1000 });

  const rawReceive = useMemo(
    () =>
      generateRecentTime(20).map((time) => {
        return {
          name: new Date(time),
          value: getRandomValue(),
        };
      }),
    []
  );

  const [addedReceive, setAddedReceive] = useState<Array<ChartValue>>([]);

  const receives = useMemo(() => {
    return [...rawReceive, ...addedReceive];
  }, [rawReceive, addedReceive]);

  const rawSent = useMemo(
    () =>
      generateRecentTime(20).map((time) => {
        return {
          name: new Date(time),
          value: getRandomValue(),
        };
      }),
    []
  );

  const [addedSent, setAddedSent] = useState<Array<ChartValue>>([]);

  const sents = useMemo(() => {
    return [...rawSent, ...addedSent];
  }, [rawSent, addedSent]);

  const [fakeReceiveDataSet, setFakeReceiveDataSet] = useState<
    Array<ChartValue>
  >([]);
  const [fakeSentDataSet, setFakeSentDataSet] = useState<Array<ChartValue>>([]);

  const DATE_FORMAT_STRING = "YYYY-MM-DDTHH:mm:ss";
  const minLocalTime = moment()
    .subtract(30, "minutes")
    .format(DATE_FORMAT_STRING);
  const maxLocalTime = moment()
    .add(15 + addedSent.length * 4 + fakeSentDataSet.length, "minutes")
    .format(DATE_FORMAT_STRING);
  const valueFromTime = Date.parse(minLocalTime);
  const valueToTime = Date.parse(maxLocalTime);

  const correctScaleInstanceTickTime = (
    scaleInstance: Scale<CoreScaleOptions>,
    deltaTimeSecond: number,
    valueFromTime: number,
    minutes: number
  ) => {
    for (
      let index = 1;
      index <= deltaTimeSecond / (minutes * 60) + 1;
      index += 1
    ) {
      scaleInstance.ticks.push({
        major: false,
        value: valueFromTime + (index - 1) * minutes * 60 * 1000,
        label: moment(valueFromTime + (index - 1) * minutes * 60 * 1000).format(
          "HH:mm"
        ),
      });
    }
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    clip: { left: 0, top: 5, right: 0, bottom: 5 },
    elements: {
      line: {
        tension: 0.15,
      },
      point: {
        backgroundColor: "#8a969c",
        hoverBackgroundColor: "#8a969c",
        hoverBorderColor: "#8a969c",
        radius: 14.5,
        hoverRadius: 4.5,
        borderWidth: 0,
        hoverBorderWidth: 0,
      },
    },
    scales: {
      x: {
        afterTickToLabelConversion: (
          scaleInstance: Scale<CoreScaleOptions>
        ): void => {
          scaleInstance.ticks = [];
          const deltaTimeSecond = (valueToTime - valueFromTime) / 1000;
          if (deltaTimeSecond > 8 * 60 * 60) {
            correctScaleInstanceTickTime(
              scaleInstance,
              deltaTimeSecond,
              valueFromTime,
              60
            );
          } else if (deltaTimeSecond > 15 * 60) {
            correctScaleInstanceTickTime(
              scaleInstance,
              deltaTimeSecond,
              valueFromTime,
              30
            );
          } else {
            scaleInstance.ticks.push({
              major: false,
              value: valueFromTime,
              label: moment(valueFromTime).format("HH:mm"),
            });
            scaleInstance.ticks.push({
              major: false,
              value: (valueFromTime + valueToTime) / 2,
              label: moment((valueFromTime + valueToTime) / 2).format("HH:mm"),
            });
            scaleInstance.ticks.push({
              major: false,
              value: valueToTime,
              label: moment(valueToTime).format("HH:mm"),
            });
          }
        },
        type: "time",
        min: minLocalTime,
        max: maxLocalTime,
        time: {
          unit: "hour" as const,
          // stepSize: 0.5,
          tooltipFormat: "HH:mm",
          displayFormats: {
            hour: "HH:mm",
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: "rgb(0,0,0,0.6)",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "rgb(0,0,0,0.6)",
        },
        title: {
          display: true,
          text: "Kbps",
          padding: 4,
          align: "center" as const,
          font: {
            size: 14,
          },
        },
        grid: {
          display: true,
          color: "#9999994d",
        },
      },
    },
    spanGaps: undefined,
    plugins: {
      title: {
        display: true,
        text: "vEdge Internet usage",
      },
      legend: {
        display: false,
        position: "top" as const,
        labels: {
          color: "rgb(0,0,0,0.6)",
        },
      },
      tooltip: {
        position: "nearest" as const,
        caretPadding: 15,
        titleColor: "white",
      },
    },
    parsing: {
      xAxisKey: "name",
      yAxisKey: "value",
    },
  };

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
        data: receives,
        borderWidth: 4,
        pointRadius: 3,
      },
      {
        label: "Predicted Kilobytes received",
        backgroundColor: "#FFF",
        borderColor: "#DD9200",
        data: [[...receives].pop(), ...fakeReceiveDataSet],
        borderDash: [1],
        borderWidth: 4,
        pointRadius: 3,
      },
      {
        label: "Kilobytes sent",
        backgroundColor: "#FFF",
        borderColor: "#666666",
        data: sents,
        borderWidth: 4,
        pointRadius: 3,
      },
      {
        label: "Predicted Kilobytes sent",
        backgroundColor: "#FFF",
        borderColor: "#666666",
        data: [[...sents].pop(), ...fakeSentDataSet],
        borderDash: [1],
        borderWidth: 4,
        pointRadius: 3,
      },
    ],
  };

  const getFakeDate = (lastValue: Date): Date => {
    const newDate = new Date(lastValue);
    newDate.setMinutes(newDate.getMinutes() + 1);
    return newDate;
  };

  useEffect(() => {
    let interval = setInterval(() => {
      const lastValue = [...receives, ...fakeReceiveDataSet].pop();

      const newDate = getFakeDate(lastValue.name);

      if (fakeReceiveDataSet.length === 3) {
        setFakeReceiveDataSet([]);
        setAddedReceive((prev) => {
          return [
            ...prev,
            {
              name: newDate,
              value: getRandomValue(),
            },
          ];
        });
      } else {
        setFakeReceiveDataSet((prev) => {
          const clone = [...prev];

          return [
            ...prev,
            {
              name: newDate,
              value: clone.length
                ? clone.pop().value
                : [...receives].pop().value,
            },
          ];
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fakeReceiveDataSet, receives]);

  useEffect(() => {
    let interval = setInterval(() => {
      const lastValue = [...sents, ...fakeSentDataSet].pop();

      const newDate = getFakeDate(lastValue.name);

      if (fakeSentDataSet.length === 3) {
        setFakeSentDataSet([]);
        setAddedSent((prev) => {
          return [
            ...prev,
            {
              name: newDate,
              value: getRandomValue(),
            },
          ];
        });
      } else {
        setFakeSentDataSet((prev) => {
          const clone = [...prev];

          return [
            ...prev,
            {
              name: newDate,
              value: clone.length ? clone.pop().value : [...sents].pop().value,
            },
          ];
        });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fakeSentDataSet, sents]);

  const handleAddPoint = () => {
    const lastSent = [...sents, ...fakeSentDataSet].pop();
    const lastReceive = [...receives, ...fakeReceiveDataSet].pop();
    setFakeSentDataSet([]);
    setAddedSent((prev) => {
      return [
        ...prev,
        {
          name: getFakeDate(lastSent.name),
          value: getRandomValue(),
        },
      ];
    });

    setFakeReceiveDataSet([]);
    setAddedReceive((prev) => {
      return [
        ...prev,
        {
          name: getFakeDate(lastReceive.name),
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
