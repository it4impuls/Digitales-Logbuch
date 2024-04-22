


export interface Course {
  id: number;
  name: string;
  host: Person;
  atendees: Person[];
  description: string;
  appointments: string[];
}

export interface Appointment {
  id: number;
  course: Course;
  dates: Date[];
  status: string;
}

export interface Person {
  id: number;
  firstname: string;
  lastname: string;
  occupation: string;
}


export class Person implements Person {
  constructor(
    public id: number = 0,
    public firstname = "John",
    public lastname = "Doe",
    public occupation = ""
  ) {}

  static fromObj(obj: Person): Person {
    return new Person(
      obj.id,
      obj.firstname,
      obj.lastname,
      obj.occupation
    );
  }
}


export class Course implements Course {
  // constructor(obj: Course);
  constructor(
    public id: number = 0,
    public name = "New Course",
    public host = new Person(),
    public description = "",
    public appointments = [] as string[],
    public atendees = [] as Person[]
  ) {}

  static fromObj(obj: Course): Course {
    return new Course(
      obj.id,
      obj.name,
      obj.host,
      obj.description,
      obj.appointments,
      obj.atendees.map(p => Person.fromObj(p))
    );
  }
}


export class Appointment implements Appointment {
  // constructor(obj: Course);
  constructor(
    public id: number = 0,
    public course: Course = new Course(),
    public dates: Date[] = [] as Date[],
    public status = ""
  ) {}

  static fromObj(obj: Appointment): Appointment {
    return new Appointment(obj.id, obj.course, obj.dates, obj.status);
  }
}