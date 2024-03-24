import mongoose, { Schema } from 'mongoose';

// An interface that describes the properties
// that a User Document has
interface IUserDoc extends mongoose.Document {
    discord_user_id: string;
    zodiac: string;
    server_id: string;
    commands_usage: Map<
        command_name,
        {
            date: Date;
            uses: number;
        }
    >;
    hugs: {
        other_discord_user_id: string;
        count: number;
    }[];
    created_at: string;
    updated_at: string;
}

type command_name = string;

const userSchema = new Schema(
    {
        discord_user_id: {
            type: String,
            required: true,
        },
        zodiac: {
            type: String,
            required: false,
        },
        server_id: {
            type: String,
            required: true,
        },
        commands_usage: {
            // command name is the key
            type: Map,
            of: {
                date: {
                    type: Date,
                    default: Date.now(),
                },
                uses: Number,
            },
        },
        hugs: [
            // this needs to be changed from array to map like above. But we need server db migration for this
            {
                other_discord_user_id: {
                    type: String,
                    required: true,
                },
                count: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
        timestamps: true,
    }
);

const User = () =>
    mongoose.model<IUserDoc, mongoose.Model<IUserDoc>>('User', userSchema);

export default (mongoose.models.User || User()) as ReturnType<typeof User>;
export type { IUserDoc };
