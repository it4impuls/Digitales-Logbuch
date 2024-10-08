import { Translation } from "./services/translate.service";


export type Translationkeys = keyof typeof Translation
type translated = {[key in Translationkeys]:any}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  username:string;
}

export interface Attendee{
  id: number;
  attendee: Person;
  attends: boolean;

}

export enum Level{
  I='I',II= 'II',III= 'III'
}

export interface Course extends translated {
  id: number;
  host: Person;
  attendees: Attendee[];
  qualification: string;
  title: string;
  level: Level;
  description_short: string;
  content_list: string;
  methods: string;
  material: string;
  dates: string;
  duration: string;
}

export interface ICourse extends Omit<Course, 'attendees'> {}

export interface PostCourse extends Omit<Course, 'host' | 'attendees'> {
}



export interface RPerson {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email:string;
}


export enum CookieType {
  refreshToken = "refresh",
  accessToken = "access",
  username = "uname"
} 

export class Attendee implements Attendee {
  constructor(public id=0,public attendee = new Person(), public attends = false) {}
  static fromObj(obj: Attendee): Attendee {
    return new Attendee(obj.id, obj.attendee, obj.attends);
  }
}

export class Person implements Person {
  constructor(
    public id: number = 0,
    public first_name = "John",
    public last_name = "Doe",
    public occupation = "",
    public username = "",
  ) {}

  static fromObj(obj: Person): Person {
    return new Person(
      obj.id,
      obj.first_name,
      obj.last_name,
      obj.occupation,
      obj.username
    );
  }
}

export class RPerson implements RPerson {
  constructor(
    public first_name = "John",
    public last_name = "Doe",
    public username = "",
    public password = "",
    public email = ""
  ) {}

  static fromObj(obj: RPerson): RPerson {
    return new RPerson(
      obj.first_name,
      obj.last_name,
      obj.username.toLowerCase(),
      obj.password,
      obj.email.toLowerCase()
    );
  }
}

export class Course implements Course {
  // constructor(obj: Course);
  constructor(
    public id: number = 0,
    public host = new Person(),
    public attendees = [] as Attendee[],
    public qualification: string = '',
    public title: string = '',
    public level: Level = Level.I,
    public description_short: string = '',
    public content_list: string = '',
    public methods: string = '',
    public material: string = '',
    public dates: string = '',
    public duration: string = ''
  ) {}

  static fromICourse(obj: ICourse): Course {
    return new Course(
      obj.id,
      obj.host,
      [] as Attendee[], //obj.attendees.map((p) => Attendee.fromObj(p)),
      obj.qualification,
      obj.title,
      obj.level,
      obj.description_short,
      obj.content_list,
      obj.methods,
      obj.material,
      obj.dates,
      obj.duration
    );
  }

  static fromObj(obj: Course): Course {
    return new Course(
      obj.id,
      obj.host,
      obj.attendees.map((p) => Attendee.fromObj(p)),
      obj.qualification,
      obj.title,
      obj.level,
      obj.description_short,
      obj.content_list,
      obj.methods,
      obj.material,
      obj.dates,
      obj.duration
    );
  }
}

export class PostCourse implements PostCourse {
  // constructor(obj: Course);
  constructor(
    public id: number = 0,
    public qualification: string = '',
    public title: string = '',
    public level: Level = Level.I,
    public description_short: string = '',
    public content_list: string = '',
    public methods: string = '',
    public material: string = '',
    public dates: string = '',
    public duration: string = ''
  ) {}
  static fromObj(obj: PostCourse): PostCourse {
    return new PostCourse(
      obj.id,
      obj.qualification,
      obj.title,
      obj.level,
      obj.description_short,
      obj.content_list,
      obj.methods,
      obj.material,
      obj.dates,
      obj.duration
    );
  }
  
}

