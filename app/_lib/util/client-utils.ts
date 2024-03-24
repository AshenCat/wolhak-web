export const getServerImage = (
    serverId: string,
    thumbnailId: string | null
) => {
    if (thumbnailId) {
        return `https://cdn.discordapp.com/icons/${serverId}/${thumbnailId}.png`;
    }
    const rand = Math.floor(Math.random() * 3);
    return `https://cdn.discordapp.com/embed/avatars/${rand}.png`;
};

export const getServerEmoji = (emojiId: string, animated: boolean) => {
    return `https://cdn.discordapp.com/emojis/${emojiId}.${
        animated ? 'gif' : 'png'
    }`;
};

export const colorIntegerToHex = (num: number) => {
    const hex = (num: number) => Number(num).toString(16).padStart(2, '0');
    let result = hex(num);
    while (result.length < 6) {
        result = '0' + result;
    }
    return result;
};
