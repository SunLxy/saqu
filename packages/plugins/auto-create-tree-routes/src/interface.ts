import FS from 'fs-extra';

export type IgnoreFunction = (file: string, stats: FS.Stats) => boolean;
export type Ignores = ReadonlyArray<string | IgnoreFunction>;
