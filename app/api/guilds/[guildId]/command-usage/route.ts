import CommandUsage, {
    ICommandUsageJson,
} from '@/app/_db/models/command-usage.model';
import {
    getDateRelativeFromNow,
    isValidLinuxTimeStamp,
} from '@/app/_lib/util/util';
import { auth } from '@/auth';
import { PipelineStage } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { guildId: string } }
) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);

    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const groupBy = searchParams.get('group-by');

    if ((from && !to) || (!from && to)) {
        return NextResponse.json(
            { error: 'query range must be a range between two dates' },
            { status: 400 }
        );
    }

    if (from && !isValidLinuxTimeStamp(from)) {
        return NextResponse.json(
            { error: '(optional) from is not a valid linux timestamp' },
            { status: 400 }
        );
    }
    if (to && !isValidLinuxTimeStamp(to)) {
        return NextResponse.json(
            { error: '(optional) to is not a valid linux timestamp' },
            { status: 400 }
        );
    }
    if (groupBy && !['day', 'month', 'year'].includes(groupBy)) {
        return NextResponse.json(
            {
                error: '(optional) groupby can only be day, month, or year',
            },
            { status: 400 }
        );
    }

    const { guildId } = params;

    try {
        console.log(`get guild ${guildId} command usage api`);

        let getMatchUnit: 'day' | 'month' | 'year' = 'day';
        if (groupBy) {
            getMatchUnit = groupBy as 'day' | 'month' | 'year';
        }

        const dateStart = getDateRelativeFromNow(-7, getMatchUnit);

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    createdAt: {
                        ...(from &&
                            to && { $gte: new Date(from), $lte: new Date(to) }),
                        ...(!(from && to) && {
                            $gte: new Date(dateStart),
                            $lte: new Date(),
                        }),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        ...((!groupBy || groupBy === 'day') && {
                            $dateFromParts: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                                day: { $dayOfMonth: '$createdAt' },
                            },
                        }),
                        // ...(groupBy === 'weekly' && {
                        //     $isoWeekYear: '$createdAt',
                        // }),
                        ...((!groupBy || groupBy === 'month') && {
                            $dateFromParts: {
                                year: { $year: '$createdAt' },
                                month: { $month: '$createdAt' },
                            },
                        }),
                        ...((!groupBy || groupBy === 'year') && {
                            $dateFromParts: {
                                year: { $year: '$createdAt' },
                            },
                        }),
                    },
                    commands: { $push: '$command_name' },
                },
            },
            { $sort: { _id: -1 } },
        ];

        /**
         *      grouped by day
            {
                _id: 2024-03-22
                commands: [
                    "dev_inspire",
                    "dev_horoscope",
                    "dev_add",
                    "dev_inspire",
                ]
            }
         */

        const [result, command_keys] = await Promise.all([
            CommandUsage.aggregate(pipeline),
            CommandUsage.find().distinct('command_name'),
        ]);

        const data = result.map((commandCallsPerDay) => ({
            _id: commandCallsPerDay._id.toISOString(),
            command_calls: commandCallsPerDay.commands.reduce(
                (acc: { [key: string]: number }, curr: string) => {
                    if (!acc[curr]) {
                        return { ...acc, [curr]: 1 };
                    }
                    return { ...acc, [curr]: acc[curr] + 1 };
                },
                {}
            ),
        }));

        const dates = Array.from(Array(8).keys()).map((ctr) =>
            getDateRelativeFromNow(
                ctr * -1,
                groupBy as 'day' | 'month' | 'year',
                { setISOHourToZero: true }
            ).toISOString()
        );

        for (const date of dates) {
            if (!data.map((item) => item._id).includes(date)) {
                // console.log(`${date} not found in data`);
                data.push({ _id: date, command_calls: {} });
            }
        }

        return NextResponse.json(
            { data: data, keys: command_keys },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
