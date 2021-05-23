const timeCal = (timeSeconds) => {
    const hours = Math.floor(timeSeconds / 60 / 60);
    const minutes = Math.floor(timeSeconds / 60) - (hours * 60);
    const seconds = timeSeconds % 60;
    return `${minutes} min  ${seconds} seconds`;
}

export default timeCal;