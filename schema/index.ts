import * as types from './pocketbase-types';

export type User = types.UsersResponse;
export type Climb = types.ClimbsResponse<{
  gym?: Gym;
  grade?: Grade;
  user?: User;
  tags?: Tag[];
  'attempts(climb)'?: Attempt[];
}>;
export type Gym = types.GymsResponse<{ grade_systems: GradeSystem[] }>;
export type Grade = types.GradesResponse;
export type GradeSystem = types.GradeSystemsResponse<{
  'grades(grade_system)'?: Grade[];
}>;
export type Tag = types.TagsResponse;
export type Attempt = types.AttemptsResponse<{
  climb?: Climb;
  user?: User;
  set?: ClimbSet;
}>;
export type ClimbSet = types.SetsResponse<{ session?: Session }>;
export type Session = types.SessionsResponse<{ gym?: Gym; user?: User }>;
