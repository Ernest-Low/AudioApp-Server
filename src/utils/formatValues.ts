export const formatSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const formatFileSize = (bytes: number): string => {
  const mb = 1024 * 1024;
  const gb = 1024 * 1024 * 1024;

  if (bytes >= gb) {
    return (bytes / gb).toFixed(2) + " GB";
  } else if (bytes >= mb) {
    return (bytes / mb).toFixed(2) + " MB";
  } else {
    return (bytes / 1024).toFixed(2) + " KB";
  }
};
