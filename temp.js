console.log('Video durations:', videoDurations);
console.log('Number of videos:', videoCount);
const averageLength = videoCount ? totalDuration / videoCount : 0;
console.log('Average video length:', averageLength, 'seconds');
console.log('Total playlist length:', totalDuration, 'seconds');

const playbackRates = [1.25, 1.5, 1.75, 2];
for (const rate of playbackRates) {
  console.log(`At ${rate}x speed:`, totalDuration / rate, 'seconds');
}