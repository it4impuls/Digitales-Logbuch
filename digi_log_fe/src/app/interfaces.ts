

export interface ICourse {
  id: number;
  name: string;
  host: Person;
  atendees: Person[];
  description: string;
  appointments: IAppointment[];
} 

export interface IAppointment {
  id: number;
  course: ICourse;
  date: string;
  status:string;
  starttime:string;
  duration:string;
}

export interface Appointment{
  id: number;
  course: ICourse | Course;
  date: string;
  status:string;
  starttime: string;
  endtime:string;
  duration: string;
}

export interface Course {
  id: number;
  name: string;
  host: Person;
  atendees: Person[];
  description: string;
  appointments: Appointment[];
}

export interface Person {
  id: number;
  firstname: string;
  lastname: string;
  occupation: string;
}


export enum CookieType {
  refreshToken = "refresh",
  accessToken = "access",
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
    public appointments = [] as Appointment[],
    public atendees = [] as Person[],

  ) {}

  static fromObj(obj: ICourse): Course {
    return new Course(
      obj.id,
      obj.name,
      obj.host,
      obj.description,
      obj.appointments.map((p) => Appointment.fromObj(p)),
      obj.atendees.map((p) => Person.fromObj(p)),
    );
  }
}


export class Appointment implements Appointment {
  // constructor(obj: Course);
  constructor(
    public id: number = 0,
    public course: ICourse | Course = new Course(),
    public date: string = "",
    public status = "",
    public starttime: string = "",
    public endtime:string = "",
    public duration: string = ""
  ) {}

  static fromObj(obj: IAppointment): Appointment {
    let startDateTime = new Date(obj.date)
    let duration = obj.duration.split(":")
    let endTime = new Date(obj.date);
    
    endTime.setHours(
      endTime.getHours() + Number(duration[0]),
      endTime.getMinutes() + Number(duration[1]),
      endTime.getSeconds() + Number(duration[2])
    );
    return new Appointment(
      obj.id,
      obj.course,
      startDateTime.toLocaleDateString(),
      obj.status,
      startDateTime.toLocaleTimeString([], { timeStyle: "short" }),
      endTime.toLocaleTimeString([], { timeStyle: "short" }),
      obj.duration
    );
  }
}