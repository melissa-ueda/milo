/** Shrinks a picked receipt photo before it's sent to the AI / stored. */
export type ImageCompressor = {
  compress(file: File): Promise<Blob>;
};
