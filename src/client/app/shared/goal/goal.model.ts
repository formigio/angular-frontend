export class Goal {
  constructor(
    public accomplished: string,
    public guid: string,
    public goal: string
  ) {}
}

export class Task {
  constructor(
    public complete: string = 'false',
    public uuid: string,
    public title: string = '',
    public goal: string,
    public state: string = 'view'
  ) {}
}

export class Invite {
  constructor(
    public uuid: string,
    public email: string,
    public goal: string
  ) {}
}
