export function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  return (
    <video
      src={videoUrl}
      aria-label="Haircut transformation video"
      controls
      autoPlay
      loop
      muted
      playsInline
      className="w-full rounded-xl"
    />
  );
}
