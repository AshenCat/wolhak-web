'use client';
import LineChart from '@/app/_components/charts/LineChart';
import useFetch from '@/app/_components/hooks/useFetch';
import Loading from '@/app/_components/loading/Loading';
import { IServerJson } from '@/app/_db/models/server.model';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';

type ServerStatsProps = {
    guild: GuildObject;
    dbServer?: IServerJson;
};

type CommandUsageType = {};

function CommandsUsageChart({ guild, dbServer }: ServerStatsProps) {
    const [series, setSeries] = useState<{ [key: string]: (number | null)[] }>(
        {}
    );
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
                command_calls: { [key: string]: number };
            }[];
            keys: string[];
        };
    } = useFetch(
        `/api/guilds/${guild.id}/command-usage?group-by=${groupBy}`,
        {},
        [groupBy]
    );

    useEffect(() => {
        if (value) {
            const sorted = value.data.sort(
                (a, b) => +new Date(a._id) - +new Date(b._id)
            );
            // console.log('sorted', sorted);
            const tempSeries: { [key: string]: (number | null)[] } = {};
            for (const item of sorted) {
                for (const key of value.keys) {
                    if (!tempSeries[key]) {
                        tempSeries[key] = [];
                    }
                    if (!item.command_calls[key]) tempSeries[key].push(0);
                    else tempSeries[key].push(item.command_calls[key]);
                }
            }
            // console.log('tempSeries', tempSeries);
            // console.log(
            //     'final',
            //     Object.entries(tempSeries).map(([key, val]) => ({
            //         name: key,
            //         type: 'line',
            //         data: val,
            //     }))
            // );
            setSeries(tempSeries);
        }
    }, [value]);

    const totalUsage: number = Object.values(series).reduce<number>(
        (acc, curr) => {
            let currTotal = 0;
            for (const item of curr) {
                if (item) {
                    currTotal += item;
                }
            }
            return acc + currTotal;
        },
        0
    );

    return (
        <div className="flex flex-col mt-8">
            {loading && (
                <div className="h-[350px] mx-auto flex justify-center items-center">
                    <Loading>Loading</Loading>
                </div>
            )}
            {!loading && error && <div>Unable to load data</div>}
            {!loading && series && (
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
                            Total Commands Usage: {totalUsage}
                        </div>
                    </div>
                    <LineChart
                        className="flex-1"
                        height={350}
                        options={{
                            dataLabels: { enabled: true },
                            title: {
                                text: `Commands usage per ${groupBy}`,
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
                                    text: 'Usage',
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
                        series={Object.entries(series).map(([key, val]) => ({
                            name: key,
                            type: 'line',
                            data: val,
                        }))}
                    />
                </>
            )}
        </div>
    );
}

export default CommandsUsageChart;
