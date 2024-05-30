import axios from 'axios';

// Replace with your actual YouTube Data API key
const apiKey = 'AIzaSyCkG5W6ZCJJkGmC2YLOi1ZvEvj6XUjeApA';

const baseUrl1 = 'https://www.googleapis.com/youtube/v3/playlistItems';
const baseUrl2 = 'https://www.googleapis.com/youtube/v3/videos';

let videoIndex = 0;
let videoDurations = [];

async function getVideoList(playlistId, nextPageToken = '') {
  const url = `${baseUrl1}?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=${apiKey}&playlistId=${playlistId}${nextPageToken? '&pageToken=' + nextPageToken : ''}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const videoIds = [];
    for (const item of data.items || []) {
      videoIds.push(item.contentDetails.videoId);
    }

    return { videoIds, nextPageToken: data.nextPageToken || null };
  } catch (error) {
    console.error('Error fetching video IDs:', error.message);
    throw error;
  }
}

async function getVideoDurations(videoIds) {
  if (!videoIds.length) return [];

  const url = `${baseUrl2}?part=contentDetails&key=${apiKey}&id=${videoIds.join(',')}&fields=items/contentDetails/duration`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const durations = [];
    for (let i = 0; i < data.items.length; i++) {
      const durationString = data.items[i].contentDetails.duration;
      if (!durationString) {
        durations.push(0); // Return 0 if duration is not available
      } else {
        const match = durationString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?S))/);
        if (!match) {
          durations.push(0); // Return 0 if duration is not in expected format
        } else {
          const hours = parseInt(match[1] || 0);
          const minutes = parseInt(match[2] || 0);
          const seconds = parseFloat(match[3] || 0);
          durations.push(hours * 3600 + minutes * 60 + seconds);
        }
      }
    }

    return durations;
  } catch (error) {
    console.error('Error fetching video durations:', error.message);
    throw error;
  }
}
async function getPlaylistLength(playlistId) {
    let nextPageToken = '';
    let totalDuration = 0;
    let videoCount = 0;
    const videoDurations = []; // Array to store video durations
    const videoDurationsById = {}; // Object to store durations by video ID
  
    do {
      const { videoIds, nextPageToken: newNextPageToken } = await getVideoList(playlistId, nextPageToken);
      const durations = await getVideoDurations(videoIds);
  
      for (let i = 0; i < videoIds.length; i++) {
        const videoId = videoIds[i];
        const duration = durations[i];
  
        if (!videoDurationsById[videoId]) {
          videoDurationsById[videoId] = duration;
          videoDurations.push(duration);
          videoCount++;
          totalDuration += duration;
        }
      }
  
      nextPageToken = newNextPageToken;
    } while (nextPageToken);
  
    console.log('Video durations:', videoDurations); // List of all unique video durations
    console.log('Number of videos:', videoCount);
    const averageLength = videoCount ? totalDuration / videoCount : 0;
    console.log('Average video length:', averageLength, 'seconds');
    console.log('Total playlist length:', totalDuration, 'seconds');
  
    const playbackRates = [1.25, 1.5, 1.75, 2];
    for (const rate of playbackRates) {
      console.log(`At ${rate}x speed:`, totalDuration / rate, 'seconds');
    }
  }
  

getPlaylistLength('PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz').catch(console.error);