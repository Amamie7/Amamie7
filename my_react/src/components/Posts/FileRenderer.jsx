import React, { useRef } from 'react';

const FileRenderer = ({ data, API_base_url }) => {
  const videoRefs = useRef([]);
  const audioRefs = useRef([]);

  console.log("FileRenderer data", data);
  console.log("API_base_url", API_base_url);
  console.log("FileRenderer data.userId", data.userId);
  const handleVideoPlay = (index) => {
    videoRefs.current.forEach((video, idx) => {
      console.log("FileRenderer video path", `${API_base_url}${video.path}`);
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
      {data.files &&
         data.files.length &&
        data.files.map((file, index) => {
          console.log("file b4w", file);
          console.log("file mimetype", file.mimetype);
          console.log("file path", file.path);
          console.log("file path API_base_url", `${API_base_url}${file.path}`);
          if (file.mimetype.startsWith("video")) {
            return (
              <div key={index}>
                <p>Video:</p>
                <video
                  style={{ width: "100%" }}
                  controls
                  ref={(el) => (videoRefs.current[index] = el)}
                  onPlay={() => handleVideoPlay(index)}
                >
                  {/* <source
                  src={`${API_base_url}${file.filepath}`}
                  type={file.mimetype}
                /> */}
                  <source
                    src={`${API_base_url}${file.path}`}
                    type={file.mimetype}
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else if (file.mimetype.startsWith("image")) {
            return (
              <div key={index}>
                <p>Image:</p>
                <img
                  style={{ width: "100%" }}
                  src={`${API_base_url}${file.path}`}
                  alt={file.fileName}
                />
              </div>
            );
          } else if (file.mimetype === "application/pdf") {
            return (
              <div key={index}>
                <p>PDF:</p>
                <a
                  href={`${API_base_url}${file.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.fileName}
                </a>{" "}
                |{" "}
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    `${API_base_url}${file.path}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Online
                </a>
              </div>
            );
          } else if (
            file.mimetype.startsWith(
              "application/vnd.openxmlformats-officedocument"
            ) ||
            file.mimetype === "application/msword"
          ) {
            return (
              <div key={index}>
                <p>Office Document:</p>
                <a
                  href={`${API_base_url}${file.path}`}
                  download={file.fileName}
                >
                  {file.fileName}
                </a>{" "}
                |{" "}
                <a
                  href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                    `${API_base_url}${file.path}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Online
                </a>
              </div>
            );
          } else if (file.mimetype.startsWith("audio")) {
            return (
              <div key={index}>
                <p>Audio:</p>
                <audio
                  style={{ width: "100%" }}
                  controls
                  ref={(el) => (audioRefs.current[index] = el)}
                  onPlay={() => handleAudioPlay(index)}
                >
                  <source
                    // src={`${API_base_url}${file.filepath}`}
                    src={`${API_base_url}${file.path}`}
                    type={file.mimetype}
                  />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            );
          } else {
            return (
              <div key={index}>
                <p>Download:</p>
                <a
                  href={`${API_base_url}${file.filepath}`}
                  download={file.fileName}
                >
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
