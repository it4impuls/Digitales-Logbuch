export interface Person {
  id: number;
  firstname: string;
  lastname: string;
  occupation: string;
}


export interface Course {
  id: number;
  name: string;
  host: Person;
  atendees: Person[];
  description:string;
}


export class Person implements Person {
  constructor(
    public id: number = 0,
    public firstname = "John",
    public lastname = "Doe",
    public occupation = ""
  ) {}
}


export class Course implements Course {
  constructor(
    public id: number = 0, 
    public name = "New Course", 
    public host=new Person(),
    public description = "",
  ) {}

}