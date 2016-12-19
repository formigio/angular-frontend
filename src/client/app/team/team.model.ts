import { User } from '../user/index';

export class Team {
  changed: boolean = false;
  constructor(
    public uuid: string,
    public identity: string,
    public title: string
  ) {}
}
export class TeamMembership {
  constructor(
    public team_uuid: string,
    public user_uuid: string,
    public user_doc: User,
    public team_doc: Team
  ) {}
}
