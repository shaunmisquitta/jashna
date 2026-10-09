from pathlib import Path

import cv2


frames_dir = Path(".hero-video-frames")
output_path = Path("hero-invitation.mp4")
frames = sorted(frames_dir.glob("frame-*.png"))

if not frames:
    raise RuntimeError("No captured hero frames were found")

first = cv2.imread(str(frames[0]))
height, width = first.shape[:2]
writer = cv2.VideoWriter(
    str(output_path),
    cv2.VideoWriter_fourcc(*"mp4v"),
    10,
    (width, height),
)

if not writer.isOpened():
    raise RuntimeError("Could not initialize the MP4 encoder")

try:
    for frame_path in frames:
        frame = cv2.imread(str(frame_path))
        if frame is None:
            raise RuntimeError(f"Could not read {frame_path}")
        writer.write(frame)
finally:
    writer.release()

print(output_path.resolve())
