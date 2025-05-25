function parseNumber(value) {
    const number = Number(value);
    return isNaN(number) ? undefined : number;
}

function parseString(value) {
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

export const parseFilterParams = (query) => {
    const {
        category,
        minPrice,
        maxPrice,
        title,
    } = query;

    const filters = {};

    const parsedCategory = parseString(category);
    if (parsedCategory) {
        filters.category = { $regex: new RegExp(`^${parsedCategory}$`, 'i') };
    }

    const parsedMinPrice = parseNumber(minPrice);
    const parsedMaxPrice = parseNumber(maxPrice);
    if (parsedMinPrice !== undefined || parsedMaxPrice !== undefined) {
        filters.price = {};
        if (parsedMinPrice !== undefined) filters.price.$gte = parsedMinPrice;
        if (parsedMaxPrice !== undefined) filters.price.$lte = parsedMaxPrice;
    }

    const parsedTitle = parseString(title);
    if (parsedTitle) {
        filters.title = { $regex: parsedTitle, $options: 'i' };
    }

    return filters;
};