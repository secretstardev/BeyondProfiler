import React, { useEffect, useState } from "react";
import ReactApexChart, { Props } from "react-apexcharts";
import "../../index.css";

interface Props2 extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sections: string[];
  data: number[];
}

const Chart: React.FC<Props2> = ({ sections, data }) => {
  const [chartData, setChartData] = useState<any>(); // eslint-disable-line

  useEffect(() => {
    setChartData({
      series: [
        {
          name: "Series 1",
          data: data,
        },
      ],
      options: {
        chart: {
          type: "radar",
        },
        fill: {
          opacity: 0.2,
          colors: ["#F08110"],
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#F08110"],
        },
        markers: {
          colors: ["#F08110"],
        },
        xaxis: {
          categories: sections,
          labels: {
            show: true,
            style: {
              colors: ["#3C3C3C"],
              fontSize: "12px",
            },
          },
        },
      },
    } as Props);
  }, [sections, data]);

  return (
    <div className="flex justify-center items-center w-[800px] h-[560px]">
      {sections?.length > 0 && data?.length > 0 && (
        <ReactApexChart
          options={chartData?.options}
          series={chartData?.series}
          type="radar"
          width={800}
          height={640}
        />
      )}
    </div>
  );
};

export default Chart;
