import "./styles.css";
import React, { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const pieOptions = {
  plugins: {
    legend: {
      display: false,

      labels: {
        font: {
          size: 12,
        },
      },
    },
  },
};

const getData = async () => {
  let response = await fetch(
    "https://storage.googleapis.com/ducky_static_assets/helpers/footprintExercise.json",
    {
      method: "GET",
      redirect: "follow",
    }
  );
  let res = await response.json();
  return res;
};

const LABELS = ["Food", "Consumption", "Energy", "Transport", "Public"];

export const App = () => {
  const [chartData, setChartData] = useState({});
  const [totalCo2, setTotalCo2] = useState(0);
  const [co2Data, setCo2Data] = useState([]);

  let data = {
    labels: LABELS,
    datasets: [
      {
        label: "# of Votes",
        data: co2Data,
        backgroundColor: [
          "#F6BA75",
          "#EF5F8A",
          "#00A1C9",
          "#673E88",
          "#3999E3",
        ],
        hoverBorderColor: ["#000"],
        hoverBorderWidth: 2,
        borderWidth: 4,
        radius: 120,
        cutout: "80%",
      },
    ],
  };

  useEffect(() => {
    getData()
      .then((res) => {
        let { categories, totalCo2mg } = res;
        setChartData(categories);
        setTotalCo2(totalCo2mg);
        let co2Data= [];

        LABELS.forEach((item) => {
          let labelData = categories[item.toLowerCase()];
          co2Data.push(labelData.co2mg);
        });

        setCo2Data(co2Data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="donut-wrapper">
      <Doughnut data={data} options={pieOptions} />
      <div className="legends-wrapper">
        {
          chartData && Object.keys(chartData).map((item)=>{

            let selectedItem = chartData[item];
            let imgUrl = `icons/${item}.svg`;
            selectedItem.percent = Math.round(selectedItem.percent);
            return (
              <div className="legend-outer">
                <React.Fragment key={item}><img src={imgUrl} alt={imgUrl} />
                <p>{item}</p>
                <small>{selectedItem.percent}%</small>
                </React.Fragment>
              </div>
            );
          }) 
        }
      </div>
    </div>
  );
};

export default App;
