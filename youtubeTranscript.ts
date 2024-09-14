import { YoutubeTranscript } from 'youtube-transcript';
import fs from 'fs';

YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=l69ov6b7DOM').then((e) => {
    fs.writeFileSync('transcript.txt', e.map(q=>q.text).join(" "));
});
