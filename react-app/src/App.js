import React, { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

function App() {
  const [videoSrc, setVideoSrc] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("Click Start to transcode");
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const doTranscode = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    setMessage("Loading ffmpeg-core.js");
    await ffmpeg.load();
    setMessage("Transcoding has started");
    ffmpeg.FS("writeFile", "test.avi", await fetchFile(file));
    await ffmpeg.run(
      "-i",
      "test.avi",
      "-c:v",
      "libx264", // Video codec
      "-c:a",
      "aac",
      "-s",
      "640x360",
      "test.mp4"
    );

    setMessage("Transcoding completed");
    const data = ffmpeg.FS("readFile", "test.mp4");
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
    setFileName(file.name);
  };
  const download = () => {
    console.log(videoSrc);
    if (videoSrc) {
      const a = document.createElement("a");
      a.href = videoSrc;
      a.download = fileName;
      a.click();
    }
  };
  return (
    <div className="App">
      <p />
      <video width={"500px"} height={"300px"} src={videoSrc} controls></video>
      <br />
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={(e) => {
          doTranscode(e);
          // setLoading(true);
        }}
      />{" "}
      {/* <button onClick={doTranscode}>Start</button> */}
      <button
        disabled={message === "Transcoding completed" ? false : true}
        onClick={download}
      >
        Download
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;
