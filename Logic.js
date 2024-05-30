import axios from 'axios';
const apiKey = import.meta.env.VITE_API_KEY; // Replace with your YouTube API key
const baseUrl1 = 'https://www.googleapis.com/youtube/v3/playlistItems';
const baseUrl2 = 'https://www.googleapis.com/youtube/v3/videos';
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
            
          }
        }
    
        nextPageToken = newNextPageToken;
      } while (nextPageToken);
    
      return videoDurations;
    
    }
    

function getTotalDuration(json, startIndex, endIndex) {
  let totalSeconds = 0;
  for (let i = startIndex; i <= endIndex; i++) {
    totalSeconds += json[i];
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secondsLeft = totalSeconds % 60;

  return `${hours} hours, ${minutes} minutes, ${secondsLeft} seconds`;
}

 export async function GetPlaylistInfo(formData) {
  let { url, startVideo, endVideo } = formData;
  let pattern = /list=([^&]+)/;
  let match = url.match(pattern);
//   console.log("from logic js "+ match[1]);
  const videoLengthJson = await getPlaylistLength(match[1]);
//  console.log(videoLengthJson);
  if (endVideo === -1) {
    endVideo = Object.keys(videoLengthJson).length - 1;
  }

  const totalDuration = getTotalDuration(videoLengthJson, startVideo, endVideo);
  return totalDuration;
}


