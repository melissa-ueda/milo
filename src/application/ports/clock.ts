/** Supplies the current time so the domain never reads the clock directly. */
export type Clock = {
  now(): Date;
};
