const supportedImageFormats = ["jpg", "jpeg", "png", "webp"] as const;

type SupportedImageFormat = typeof supportedImageFormats[number];

const matchSupportedImageFormats = (format: string): boolean => {
  return supportedImageFormats.includes(format as SupportedImageFormat);
};

const defaultImageFormat = "jpg";

export default SupportedImageFormat;

export {
  supportedImageFormats,
  matchSupportedImageFormats,
  defaultImageFormat,
};
