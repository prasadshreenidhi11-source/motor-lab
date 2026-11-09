import { forwardRef, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const POSTER_PATH = '/images/inspection-girl.png';
const VIDEO_PATH = '/videos/inspection-girl.mp4';

const PartsInfo = forwardRef(function PartsInfo(
  { component, revealed, isClosing, onClose },
  ref
) {
  const videoRef = useRef(null);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const [posterUnavailable, setPosterUnavailable] = useState(false);

  useEffect(() => {
    setVideoUnavailable(false);
    setPosterUnavailable(false);
  }, [component.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!revealed || isClosing) {
      video.pause();
      return undefined;
    }

    video.play().catch(() => setVideoUnavailable(true));
    return () => video.pause();
  }, [revealed, isClosing, videoUnavailable]);

  const showVideo = revealed && !videoUnavailable;

  return (
    <aside
      className={`parts-info${revealed && !isClosing ? ' is-visible' : ''}${isClosing ? ' is-closing' : ''}`}
      ref={ref}
      aria-label={`${component.title} component inspection`}
      aria-hidden={!revealed && !isClosing}
    >
      <div className="parts-info__topline">
        <span><i /> COMPONENT INSPECTION</span>
        <button type="button" className="parts-info__icon-close" onClick={onClose} aria-label="Close inspection">
          <X size={17} />
        </button>
      </div>

      <div className="parts-info__media">
        {showVideo ? (
          <video
            ref={videoRef}
            src={VIDEO_PATH}
            poster={POSTER_PATH}
            muted
            autoPlay
            loop
            playsInline
            controls={false}
            preload="auto"
            aria-label="Animated character presenting the selected component"
            onError={() => setVideoUnavailable(true)}
          />
        ) : !posterUnavailable ? (
          <img
            src={POSTER_PATH}
            alt="Component inspection assistant"
            onError={() => setPosterUnavailable(true)}
          />
        ) : (
          <div className="parts-info__media-missing">
            <span>MEDIA ASSET</span>
            <code>/images/inspection-girl.png</code>
          </div>
        )}
        <span className="parts-info__media-caption">MOTORLAB · TECHNICAL ASSISTANT</span>
      </div>

      <div className="parts-info__heading">
        <span className="parts-info__index">01 / SELECTED SYSTEM</span>
        <h2>{component.title}</h2>
        <p>BUGATTI CHIRON</p>
      </div>

      <p className="parts-info__description">{component.description}</p>

      <dl className="parts-info__facts">
        <div>
          <dt>SYSTEM</dt>
          <dd>{component.system}</dd>
        </div>
        <div>
          <dt>FUNCTION</dt>
          <dd>{component.function}</dd>
        </div>
        <div>
          <dt>ENGINEERING DETAILS</dt>
          <dd>{component.details}</dd>
        </div>
      </dl>

      <button type="button" className="parts-info__close" onClick={onClose}>
        <span> CLOSE INSPECTION</span>
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
});

export default PartsInfo;
