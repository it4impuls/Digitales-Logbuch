import { Injectable } from '@angular/core';
import { Course } from '../interfaces';

export enum Translation {
  id = 'id',
  qualification = 'Qualifizierungsbereich',
  title = 'Titel',
  level = 'Level',
  description_short = 'Kurzbeschreibung',
  content_list = 'Inhalte des Kurses',
  methods = 'Methoden',
  material = 'Material/Unterlagen',
  dates = 'Wann?',
  duration = 'Dauer',
  host = 'Anbieter',
  attendees= 'Teilnehmer',
}

export function _(key:keyof typeof Translation){
  return Translation[key];
}

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }

  _(key:keyof typeof Translation){
    return Translation[key];

  }
}
