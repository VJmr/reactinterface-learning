import React, { Component } from 'react';
import AddAppointments from './AddAppointments.js';
import SearchAppointments from './SearchAppointments.js';
import ListAppointments from './ListAppointments.js';
import '../css/App.css';

import {without, findIndex} from 'lodash';

class App extends Component{

  constructor() {
    super();
    this.state = {
      myAppointments: [],
      lastIndex: 0,
      formDisplay: false,
      orderBy: 'petName',
      queryText: '',
      orderDir: 'asc'
    }
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.changeQueryText = this.changeQueryText.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({lastIndex: this.state.lastIndex + 1});
          return item;
        })
        this.setState({
          myAppointments: apts
        })
      })
  }

  deleteAppointment(appointment) {
    let apts = this.state.myAppointments;
    apts = without(apts, appointment);
    this.setState({
      myAppointments: apts
    })
  }

  addAppointment(appointment) {
    appointment.aptId = this.state.lastIndex;
    let tempApts = this.state.myAppointments;
    tempApts.push(appointment);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    })
  }

  toggleForm() {
    this.setState({
    formDisplay: !this.state.formDisplay
    })
  }

  changeOrder(orderBy, orderDir) {
    this.setState({
      orderBy: orderBy,
      orderDir: orderDir
    })
  }

  changeQueryText(query) {
    this.setState({
      queryText: query
    })
  }

  updateInfo(name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(tempApts, {
      aptId: id
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts
    });
  }

  render() {
    let order;
    let filteredApts = this.state.myAppointments;
    if(this.state.orderDir === 'asc'){
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => {
      if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()){
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(item => {
      return(
        item['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        item['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        item['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase())
      )
    });

    return (
      <main className="page bg-white" id="petratings">
          <div className="container">
            <div className="row">
              <div className="col-md-12 bg-white">
                <div className="container">
                  <AddAppointments formDisplay={this.state.formDisplay} toggleForm={this.toggleForm} addAppointment={this.addAppointment}/>
                  <SearchAppointments orderBy={this.state.orderBy} orderDir={this.state.orderDir} changeOrder= {this.changeOrder} changeQueryText={this.changeQueryText} 
                   />
                  <ListAppointments appointments={filteredApts} deleteAppointment={this.deleteAppointment} updateInfo={this.updateInfo}/>
                </div>
              </div>
            </div>
          </div>
      </main>
    );
  }
}

export default App;

