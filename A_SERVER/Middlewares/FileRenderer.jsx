import React, { useRef } from 'react';

const FileRenderer = ({ data, API_base_url }) => {
  const videoRefs = useRef([]);
  const audioRefs = useRef([]);

  const handleVideoPlay = (index) => {
    videoRefs.current.forEach((video, idx) => {
      if (video && index !== idx) {
        video.pause();
      }
    });
  };

  const handleAudioPlay = (index) => {
    audioRefs.current.forEach((audio, idx) => {
      if (audio && index !== idx) {
        audio.pause();
      }
    });
  };

  return (
    <div>
      {data.map((file, index) => {
        if (file.fileType.startsWith('video')) {
          return (
            <div key={index}>
              <p>Video:</p>
              <video
                style={{ width: '100%' }}
                controls
                ref={(el) => (videoRefs.current[index] = el)}
                onPlay={() => handleVideoPlay(index)}
              >
                <source src={`${API_base_url}${file.filePath}`} type={file.fileType} />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        } else if (file.fileType.startsWith('image')) {
          return (
            <div key={index}>
              <p>Image:</p>
              <img style={{ width: '100%' }} src={`${API_base_url}${file.filePath}`} alt={file.fileName} />
            </div>
          );
        } else if (file.fileType === 'application/pdf') {
          return (
            <div key={index}>
              <p>PDF:</p>
              <a href={`${API_base_url}${file.filePath}`} target="_blank" rel="noopener noreferrer">
                {file.fileName}
              </a>{' '}
              |{' '}
              <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(`${API_base_url}${file.filePath}`)}`} target="_blank" rel="noopener noreferrer">
                View Online
              </a>
            </div>
          );
        } else if (file.fileType.startsWith('application/vnd.openxmlformats-officedocument') || file.fileType === 'application/msword') {
          return (
            <div key={index}>
              <p>Office Document:</p>
              <a href={`${API_base_url}${file.filePath}`} download={file.fileName}>
                {file.fileName}
              </a>{' '}
              |{' '}
              <a href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(`${API_base_url}${file.filePath}`)}`} target="_blank" rel="noopener noreferrer">
                View Online
              </a>
            </div>
          );
        } else if (file.fileType.startsWith('audio')) {
          return (
            <div key={index}>
              <p>Audio:</p>
              <audio
                style={{ width: '100%' }}
                controls
                ref={(el) => (audioRefs.current[index] = el)}
                onPlay={() => handleAudioPlay(index)}
              >
                <source src={`${API_base_url}${file.filePath}`} type={file.fileType} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <p>Download:</p>
              <a href={`${API_base_url}${file.filePath}`} download={file.fileName}>
                {file.fileName}
              </a>
            </div>
          );
        }
      })}
    </div>
  );
};

export default FileRenderer;
