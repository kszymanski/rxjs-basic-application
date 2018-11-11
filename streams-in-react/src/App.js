import React, { Component } from 'react';
import { Container, Header, Divider, Card, Image, Icon } from 'semantic-ui-react'
import { of, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { debounceTime, map, switchMap, catchError } from 'rxjs/operators';

import './App.scss';

class App extends Component {
  state = {
    users: []
  }
  subscription;

  inputValueSubject = new Subject();
  inputValue$ = this.inputValueSubject.asObservable();

  change = ({ target }) => {
    this.inputValueSubject.next(target.value);
  }

  display = (users) => {
    this.setState({ users });
  }

  componentDidMount() {
    this.subscription = this.inputValue$.pipe(
      debounceTime(400),
      switchMap(value => {
        return ajax(`https://api.github.com/search/users?q=${value}`).pipe(
          map(resp => resp.response.items),
          catchError(err => of([]))
        )
      })
    )
    .subscribe(users => {
      this.display(users);
    });
  }

  componentWillUnmount(){
    if(this.subscription){
      this.subscription.unsubscribe()
    }
  }

  render() {
    let { users } = this.state;
    return (
      <div>
        <Container text>
          <Header as='h2'>Very (not)advanced github user search ;)</Header>
          <div className={`ui fluid icon input`}>
            <input type='text' id='search' placeholder='do not hesitate! just search...' onChange={this.change} />
            <i className="circular search link icon" onClick={this.click}></i>
          </div>
        </Container>
        <Divider />
        <div className='userlist'>
          {
            users.map(user => (
              <div className='item' key={user.node_id}>
                <Card>
                  <Image src={user.avatar_url} size='medium' />
                  <Card.Content>
                    <Card.Header>{user.login}</Card.Header>
                    <Card.Meta>
                      <span className='date'><a href={user.html_url}>{user.html_url}</a></span>
                    </Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name='star' />
                    {user.score}
                  </Card.Content>
                </Card>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
