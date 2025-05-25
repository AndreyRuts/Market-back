const ALLOWED_SORT_FIELDS = ['title', 'price', 'createdAt'];

function parseSortBy(value) {
    if (!value || !ALLOWED_SORT_FIELDS.includes(value)) {
        return '_id';
    }
    return value;
}

function parseSortOrder(value) {
    if (!value || (value !== 'asc' && value !== 'desc')) {
        return 'asc';
    }
    return value;
}

export const parseSortParams = (query) => {
    const { sortBy, sortOrder } = query;

    const parsedSortBy = parseSortBy(sortBy);
    const parsedSortOrder = parseSortOrder(sortOrder);

    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder
    };
};