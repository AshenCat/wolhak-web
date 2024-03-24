import Hug from '@/app/_db/models/hug.model';
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
            {
                error: 'query range (from and to) must be a range between two dates',
            },
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
        console.log(`get guild ${guildId} hugs api`);

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
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
        ];

        const result = await Hug.aggregate(pipeline);
        // console.log(result);

        const data = result.map((item) => ({
            _id: item._id.toISOString(),
            count: item.count,
        }));

        const dates = Array.from(Array(8).keys()).map((ctr) =>
            getDateRelativeFromNow(
                ctr * -1,
                groupBy as 'day' | 'month' | 'year',
                { setISOHourToZero: true }
            ).toISOString()
        );

        // console.log(dates);
        // console.log(data);

        for (const date of dates) {
            if (!data.map((item) => item._id).includes(date)) {
                // console.log(`${date} not found in data`);
                data.push({ _id: date, count: 0 });
            }
        }

        return NextResponse.json({ data: data }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
