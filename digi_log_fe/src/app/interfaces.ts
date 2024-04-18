export interface Person {
  id: number;
  firstname: string;
  lastname: string;
  occupation: string;
}


export interface Event {
  id: number;
  name: string;
  host: Person;
  atendees: Person[];
}


export class Person implements Person {
  constructor(
    public id: number = 0,
    public firstname = "John",
    public lastname = "Doe",
    public occupation = ""
  ) {}
}


export class Event implements Event {
  constructor(
    public id: number = 0, 
    public name = "New Event", 
    public host=new Person()
  ) {}

}