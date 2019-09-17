import { Project } from 'theatre';

type $IntentionalAny = any;
type $FixMe = any;
type $FixMeNow = any;

interface ITheatreStaggerFinalAPI {
  play: (options?: Partial<IPlayOptions>) => void;
  pause: () => void;
  stop: () => void;
  clone: (newMode: string) => ITheatreStaggerFinalAPI;
  time: number;
  playing: boolean;
}

interface IStaggerOptions<T> {
  project: Project | string;
  elements: Array<T>;
  props: string[];
  onValueChanges: (element: T, values: any) => void;
  filter?: TFilterFunction;
}

type TSortFunction<T> = (elements: Array<T>) => number[] | (number[])[];
type TFilterFunction<T> = (element: T, index: number) => boolean;

type TDefaultSortTypes = 'normal' | 'shuffle' | 'center';

interface IPlayOptions {
  gap: number;
  sort: TDefaultSortTypes | TSortFunction;
  reverse: boolean;
  rate: number;
  delay: number;
  mode: 'reset' | 'continue' | 'blend';
}

type TCreateTheatreStagger = (name: string, options: IStaggerOptions<T>, mode?: string) => ITheatreStaggerFinalAPI;
