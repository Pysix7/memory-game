const elapsedTime = (ts1, ts2) => {
    const startDate = new Date(ts1);
    const endDate = new Date(ts2);
    const diffInSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

    const hours = Math.floor(diffInSeconds / 60 / 60);
    const minutes = Math.floor(diffInSeconds / 60) - (hours * 60);
    const seconds = diffInSeconds % 60;
    return `${minutes} min  ${seconds} seconds`;
}

module.exports = elapsedTime;