export function checkForAggressiveRefreshInterval(startTime, refreshInterval, widgetName) {
    // Aggressive factor
    let aggresiveFactor = 10;

    let finishTime = new Date();
    let durationOfUpdateInMs = finishTime - startTime;
    let reasonableRefreshIntervalInSecs = (durationOfUpdateInMs / 1000) * aggresiveFactor;
    if (refreshInterval < reasonableRefreshIntervalInSecs) {
        console.warn(
            `${widgetName}: refresh interval (${refreshInterval}s) is fast compared to length of update (${durationOfUpdateInMs / 1000}s)`
        );
    }
}
