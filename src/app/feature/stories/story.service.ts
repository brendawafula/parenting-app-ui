import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { medicationRoutineStory } from './story-data/medication-routine-story';
import { puttingOutFireStory } from './story-data/putting-out-fire-story';
import { Story } from './story.model';
import { breadAndBullyStory } from './story-data/bread-and-bully-story';
import { bibiSaraStory } from './story-data/bibi-sara-story';
import { whatsappNegative } from './story-data/whatsapp-negative';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  constructor() { }

  getStoryList(): Observable<Story[]> {
    return of([medicationRoutineStory, puttingOutFireStory, breadAndBullyStory, bibiSaraStory, whatsappNegative]);
  }
}
