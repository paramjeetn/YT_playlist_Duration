async function getPlaylistLength(playlistId) {
  let nextPageToken = '';
  let totalDuration = 0;
  let videoCount = 0;

  do {
    const { videoIds, nextPageToken: newNextPageToken } = await getVideoList(playlistId, nextPageToken);
    await getVideoDurations(videoIds);

    videoCount = videoDurations.length;

    nextPageToken = newNextPageToken;
  } while (nextPageToken);

  totalDuration = videoDurations.reduce((sum, duration) => sum + duration, 0);

  console.log('Video durations:', videoDurations);

  const averageLength = videoCount? totalDuration / videoCount : 0;

  console.log('Number of videos:', videoCount);
  console.log('Average video length:', averageLength, 'econds');
  console.log('Total playlist length:', totalDuration, 'econds');

  const playbackRates = [1.25, 1.5, 1.75, 2];
  for (const rate of playbackRates) {
    console.log(`At ${rate}x speed:`, totalDuration / rate, 'econds');
  }
}