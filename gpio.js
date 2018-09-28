const fakePinStatuses = {
    1: 'Low',
    2: 'Low',
    3: 'Low',
    4: 'Low',
    5: 'Low'
};

const getAllPinStatuses = () => {
    return fakePinStatuses;
};

const getPinStatus = (id) => {
    return fakePinStatuses[id];
};

module.exports = {
    getAllPinStatuses,
    getPinStatus
};