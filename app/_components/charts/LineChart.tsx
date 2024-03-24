import { ApexOptions } from 'apexcharts';
import React, { HTMLAttributes } from 'react';
import ReactApexChart from 'react-apexcharts';

interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
    height: number;
    options: ApexOptions;
    series: ApexAxisChartSeries;
}

function LineChart({ height, options, series, ...props }: LineChartProps) {
    return (
        <div {...props}>
            <ReactApexChart height={height} options={options} series={series} />
        </div>
    );
}

export default LineChart;
