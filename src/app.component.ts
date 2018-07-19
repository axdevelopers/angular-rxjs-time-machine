import { Component } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/startWith'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/mapTo'
import { Subject } from 'rxjs/Subject'
import { Store } from '@ngrx/store'
import { SECOND, HOUR } from './reducers'
// Updated to Angular 2 final @NgModule features
// For more infor on modules, check out:
// https://egghead.io/lessons/angular-2-create-application-specific-angular-2-components)
@Component({
    selector: 'app',
    template: `
        <input #inputNum type="number" value="0">
        <button (click)="click$.next(inputNum.value)">Update</button>
        <clock [time]="time | async"></clock>
        
        <div *ngFor="let person of people | async">
            {{person.name}} is in {{person.time | date:'medium'}}        
        </div>
        `
})
export class App {
    click$ = new Subject()
        .map((value: string) => ({type: HOUR, payload: parseInt(value)}))

    seconds$ = Observable
        .interval(1000)
        .mapTo({type: SECOND, payload: 1})

    time
    people

    constructor(store: Store<any>) {
        this.time = store.select('clock')
        this.people = store.select('people')


        Observable.merge(
            this.click$,
            this.seconds$
        )
            .subscribe(store.dispatch.bind(store))
    }
}