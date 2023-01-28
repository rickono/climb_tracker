/**
 * This file was @generated using pocketbase-typegen
 */

export enum Collections {
  Attempts = 'attempts',
  Climbs = 'climbs',
  GradeSystems = 'grade_systems',
  Grades = 'grades',
  Gyms = 'gyms',
  Sessions = 'sessions',
  Sets = 'sets',
  TagGroup = 'tag_group',
  Tags = 'tags',
  Users = 'users',
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export enum AttemptsResultOptions {
  'progress' = 'progress',
  'regression' = 'regression',
  'plateau' = 'plateau',
}

export enum AttemptsTypeOptions {
  'flash' = 'flash',
  'redpoint' = 'redpoint',
  'repeat' = 'repeat',
  'beta' = 'beta',
  'campus' = 'campus',
}
export type AttemptsRecord = {
  climb: RecordIdString;
  result: AttemptsResultOptions;
  user: RecordIdString;
  attempt_number: number;
  notes?: string;
  rest_seconds?: number;
  attempt_in_set: number;
  attempt_date: IsoDateString;
  set?: RecordIdString;
  send?: boolean;
  type: AttemptsTypeOptions;
};

export enum ClimbsDisciplineOptions {
  'boulder' = 'boulder',
  'sport' = 'sport',
}

export enum ClimbsSettingOptions {
  'gym' = 'gym',
  'outdoor' = 'outdoor',
}

export enum ClimbsAngleOptions {
  'slab' = 'slab',
  'vertical' = 'vertical',
  'overhang-1' = 'overhang-1',
  'overhang-2' = 'overhang-2',
  'overhang-3' = 'overhang-3',
}
export type ClimbsRecord = {
  discipline: ClimbsDisciplineOptions;
  setting: ClimbsSettingOptions;
  name: string;
  image?: string;
  gym?: RecordIdString;
  grade: RecordIdString;
  moves: number;
  user: RecordIdString;
  angle: ClimbsAngleOptions;
  active?: boolean;
  tags?: RecordIdString[];
};

export enum GradeSystemsDisciplineOptions {
  'boulder' = 'boulder',
  'sport' = 'sport',
}
export type GradeSystemsRecord = {
  name: string;
  discipline: GradeSystemsDisciplineOptions;
};

export enum GradesDisciplineOptions {
  'sport' = 'sport',
  'boulder' = 'boulder',
}

export enum GradesSystemOptions {
  'font' = 'font',
  'hueco' = 'hueco',
  'yds' = 'yds',
  'french' = 'french',
}
export type GradesRecord = {
  discipline: GradesDisciplineOptions;
  grade: string;
  system: GradesSystemOptions;
  sort_key?: number;
  grade_system: RecordIdString;
};

export enum GymsDisciplinesOptions {
  'boulder' = 'boulder',
  'sport' = 'sport',
}
export type GymsRecord = {
  name: string;
  disciplines: GymsDisciplinesOptions[];
  grade_systems: RecordIdString[];
  user: RecordIdString;
};

export type SessionsRecord = {
  gym: RecordIdString;
  user: RecordIdString;
  start: IsoDateString;
  end?: IsoDateString;
};

export type SetsRecord = {
  rest_seconds?: number;
  session: RecordIdString;
  set_in_session: number;
};

export enum TagGroupForOptions {
  'climb' = 'climb',
}
export type TagGroupRecord = {
  name: string;
  for: TagGroupForOptions;
};

export type TagsRecord = {
  name?: string;
  for?: RecordIdString;
};

export type UsersRecord = {
  name?: string;
  avatar?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type AttemptsResponse<Texpand = unknown> = AttemptsRecord &
  BaseSystemFields<Texpand>;
export type ClimbsResponse<Texpand = unknown> = ClimbsRecord &
  BaseSystemFields<Texpand>;
export type GradeSystemsResponse<Texpand = unknown> = GradeSystemsRecord &
  BaseSystemFields<Texpand>;
export type GradesResponse<Texpand = unknown> = GradesRecord &
  BaseSystemFields<Texpand>;
export type GymsResponse<Texpand = unknown> = GymsRecord &
  BaseSystemFields<Texpand>;
export type SessionsResponse<Texpand = unknown> = SessionsRecord &
  BaseSystemFields<Texpand>;
export type SetsResponse<Texpand = unknown> = SetsRecord &
  BaseSystemFields<Texpand>;
export type TagGroupResponse = TagGroupRecord & BaseSystemFields;
export type TagsResponse<Texpand = unknown> = TagsRecord &
  BaseSystemFields<Texpand>;
export type UsersResponse = UsersRecord & AuthSystemFields;

export type CollectionRecords = {
  attempts: AttemptsRecord;
  climbs: ClimbsRecord;
  grade_systems: GradeSystemsRecord;
  grades: GradesRecord;
  gyms: GymsRecord;
  sessions: SessionsRecord;
  sets: SetsRecord;
  tag_group: TagGroupRecord;
  tags: TagsRecord;
  users: UsersRecord;
};
