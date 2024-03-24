'use client';
import LineChart from '@/app/_components/charts/LineChart';
import useFetch from '@/app/_components/hooks/useFetch';
import Loading from '@/app/_components/loading/Loading';
import React, { useEffect, useState } from 'react';

type HugsChartProps = {
    guild: GuildObject;
};

function HugsChart({ guild }: HugsChartProps) {
    const [groupBy, setGroupBy] = useState<'day' | 'month' | 'year'>('day');
    const {
        loading,
        error,
        value,
    }: {
        loading: boolean;
        error: Error | undefined;
        value: {
            data: {
                _id: string;
                count: number;
            }[];
        };
    } = useFetch(`/api/guilds/${guild.id}/hugs?group-by=${groupBy}`, {}, [
        groupBy,
    ]);

    const hugsTotal: number = (() => {
        if (loading || error) {
            return 0;
        }
        return value.data.reduce<number>((acc, curr) => {
            return acc + curr.count;
        }, 0);
    })();

    return (
        <div className="flex flex-col mt-8">
            {loading && (
                <div className="h-[350px] mx-auto flex justify-center items-center">
                    <Loading>Loading</Loading>
                </div>
            )}
            {!loading && error && <div>Unable to load data</div>}
            {!loading && value && (
                <>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex md:gap-2">
                            <button
                                className="grow md:grow-0 py-2 border-2 md:px-4"
                                onClick={() => setGroupBy('day')}
                            >
                                Day
                            </button>
                            <button
                                className="grow md:grow-0 py-2 border-2 md:px-4"
                                onClick={() => setGroupBy('month')}
                            >
                                Month
                            </button>
                            <button
                                className="grow md:grow-0 py-2 border-2 md:px-4"
                                onClick={() => setGroupBy('year')}
                            >
                                Year
                            </button>
                        </div>
                        <div className="flex items-center text-right mx-auto md:mx-[unset] md:ml-auto">
                            Total Hugs: {hugsTotal}
                        </div>
                    </div>
                    <LineChart
                        className="flex-1"
                        height={350}
                        options={{
                            dataLabels: { enabled: true },
                            title: {
                                text: `Total Hugs per ${groupBy}`,
                                align: 'left',
                            },
                            labels: value.data
                                .sort(
                                    (a, b) =>
                                        +new Date(a._id) - +new Date(b._id)
                                )
                                .map((item) => item._id),
                            xaxis: {
                                type: 'datetime',
                            },
                            stroke: {
                                width: 2,
                                curve: 'smooth',
                            },
                            yaxis: {
                                title: {
                                    text: 'Amount',
                                },
                                min: 0,
                            },
                            chart: {
                                toolbar: {
                                    show: false,
                                },
                                zoom: {
                                    enabled: false,
                                },
                            },
                        }}
                        series={[
                            {
                                name: 'Hugs',
                                type: 'line',
                                data: value.data
                                    .sort(
                                        (a, b) =>
                                            +new Date(a._id) - +new Date(b._id)
                                    )
                                    .map((item) => item.count),
                            },
                        ]}
                    />
                </>
            )}
        </div>
    );
}

export default HugsChart;
