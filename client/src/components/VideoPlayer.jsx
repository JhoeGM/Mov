const VideoPlayer = ({ src }) => {
  return (
    <div className="video-container">
      <div className="video-inner">
        <video className="video-element" controls src={src}>
          Sorry, your browser doesn&apos;t support video playback.
        </video>
      </div>
      <div className="video-footer-bar">
        <span>Source</span>
        <span>Episode</span>
        <span>1080p</span>
        <span>Download</span>
      </div>
    </div>
  );
};

export default VideoPlayer;
