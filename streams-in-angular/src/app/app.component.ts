import { Component, OnInit } from '@angular/core';
import { of, Subject, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { debounceTime, map, switchMap, catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users$: Observable<any[]>;
  search = new FormControl('');
  ngOnInit(){
    this.users$ = this.search.valueChanges.pipe(
      debounceTime(400),
      switchMap(value => {
        return ajax(`https://api.github.com/search/users?q=${value}`).pipe(
          map(resp => resp.response.items),
          catchError(err => of([]))
        )
      })
    );
  }
}
