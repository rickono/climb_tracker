import PocketBase, {
  ClientResponseError,
  RecordAuthResponse,
} from 'pocketbase';
import {
  User,
  Climb,
  Gym,
  Grade,
  Tag,
  Attempt,
  ClimbSet,
  Session,
  GradeSystem,
} from '@/schema';

type ApiResponse<T> = {
  data?: T;
  error?: ClientResponseError;
};

type params = {
  page?: number;
  filter?: string;
  expand?: string;
};

const response = <T>(data?: T, error?: ClientResponseError) => {
  return {
    data,
    error,
  };
};

export class ApiClient {
  constructor(private pb: PocketBase) {
    pb.autoCancellation(false);
  }

  // Authentication
  async login(username: string, password: string) {
    await this.pb.collection('users').authWithPassword(username, password);
  }

  async logout() {
    this.pb.authStore.clear();
  }

  getUser() {
    return this.pb.authStore.model;
  }

  // Sessions
  async getSessions({ page, filter = '', expand = '' }: params) {
    return await (
      await this.pb.collection('sessions').getList<Session>(page ?? 1, 20, {
        filter,
        expand,
      })
    ).items;
  }

  async getSessionById(sessionId: string) {
    return await this.pb.collection('sessions').getOne<Session>(sessionId, {
      expand: 'gym',
    });
  }

  async createSession(session: Partial<Session>) {
    return await this.pb.collection('sessions').create<Session>(session);
  }

  async updateSession(sessionId: string, session: Partial<Session>) {
    return await this.pb
      .collection('sessions')
      .update<Session>(sessionId, session);
  }

  // Sets
  async getSets({ page, filter, expand }: params) {
    return await this.pb.collection('sets').getList<ClimbSet>(page ?? 1, 20, {
      filter,
      expand,
    });
  }

  async createSet(set: Partial<ClimbSet>) {
    return await this.pb.collection('sets').create<ClimbSet>(set);
  }

  // Attemots
  async getAttempts({ page, filter, expand }: params) {
    return (
      await this.pb.collection('attempts').getList<Attempt>(page ?? 1, 20, {
        filter,
        expand,
      })
    ).items;
  }

  async getAttemptsForSet(setId: string, page?: number) {
    return (
      await this.pb.collection('attempts').getList<Attempt>(page ?? 1, 20, {
        filter: `set = '${setId}'`,
        expand: 'climb,climb.grade',
      })
    ).items;
  }

  async getAttemptsForSession(sessionId: string) {
    const sets = await this.getSets({
      filter: `session = '${sessionId}'`,
    });
    return (
      await Promise.all(
        sets.items.map(async (set) => {
          return await this.getAttemptsForSet(set.id);
        })
      )
    ).flat();
  }

  async createAttempt(attempt: Partial<Attempt>) {
    return await this.pb
      .collection('attempts')
      .create<Attempt>(attempt, { expand: 'climb,climb.grade' });
  }

  async updateAttempt(attemptId: string, attempt: Partial<Attempt>) {
    return await this.pb
      .collection('attempts')
      .update<Attempt>(attemptId, attempt, { expand: 'climb,climb.grade' });
  }

  // Climbs
  async getClimbs({ page, filter = '', expand = '' }: params) {
    return (
      await this.pb
        .collection('climbs')
        .getList<Climb>(page ?? 1, 20, { filter, expand })
    ).items;
  }

  async getClimbById(climbId: string, { expand = '' }: params) {
    return await this.pb
      .collection('climbs')
      .getOne<Climb>(climbId, { expand });
  }

  async getClimbsForSession(sessionId: string) {
    const sets = await this.getSets({ filter: `session = '${sessionId}'` });
    const climbIds = (
      await Promise.all(
        sets.items.map(async (set) => {
          const attempts = await this.getAttemptsForSet(set.id);
          return attempts.map((attempt) => attempt.climb);
        })
      )
    ).flat();
    return await Promise.all(
      climbIds.map(async (climbId) => {
        return await this.getClimbById(climbId, {});
      })
    );
  }

  async createClimb(climb: Partial<Climb>) {
    return await this.pb.collection('climbs').create<Climb>(climb);
  }

  async updateClimb(climbId: string, climb: Partial<Climb>) {
    return await this.pb.collection('climbs').update<Climb>(climbId, climb);
  }

  // Grades
  async getGrades(page?: number) {
    return (await this.pb.collection('grades').getList<Grade>(page ?? 1, 20))
      .items;
  }

  // Grade Systems
  async getGradeSystems({ page, filter = '', expand = '' }: params) {
    return (
      await this.pb
        .collection('grade_systems')
        .getList<GradeSystem>(page ?? 1, 20, { filter, expand })
    ).items;
  }

  // Gyms
  async getGyms({ page, filter = '', expand = '' }: params) {
    return (
      await this.pb
        .collection('gyms')
        .getList<Gym>(page ?? 1, 20, { filter, expand })
    ).items;
  }

  async getGymById(gymId: string, { expand = '' }: params) {
    return await this.pb.collection('gyms').getOne<Gym>(gymId, { expand });
  }

  async createGym(gym: Partial<Gym>, { expand = '' }: params) {
    return await this.pb.collection('gyms').create<Gym>(gym, { expand });
  }
}
