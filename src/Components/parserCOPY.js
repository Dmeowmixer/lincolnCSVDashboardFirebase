import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';

import firebase from './Firebase';

const JsonTable = require('ts-react-json-table');
const db = firebase.database().ref('lincolnViewer');

class Parser extends Component {
  state = {
    data: [],
    totalDonations: null
  }

  componentDidMount(){
    let total = 0;
    this.fileInput = React.createRef();
    db.on('value', (snapshot) => {
      this.setState({
        data: snapshot.val()
      }, this.getTotalDonations)
    })
  }

  getTotalDonations(){
    // const { data } = this.state;
    const data = this.state.data;
    
    const totalDonations = (data || [])
      .filter(x => x.donation_amount && x.donor_id !== "")
      .reduce((acc, curr) => {
        return acc += parseFloat(curr.donation_amount)
      }, 0)
    this.setState({
      totalDonations: totalDonations
    });
  }

// On file upload
  handleReadCSV = (snapshot) => {
    // const { data: stateDat } = this.state;
    const data = this.state.data.concat(snapshot.data)

    db.set(data)

    this.setState({
      data: data
    }, this.getTotalDonations)
  }
  handleonError = (err, file, inputEle, reason) => {
    
    console.log(err);
  }
  hideAnon = () => {
    let totalRemoved = 0;
    if(this.state.data !== null){
      this.setState({
        data: this.state.data.filter(x => {
          if(x.donor_name === ""){
            totalRemoved += parseFloat(x.donation_amount);
          }
          return x.donor_name !== "";
        }),
        totalDonations: this.state.totalDonations-totalRemoved
      })
    }
  }

// Undo hide anonymous
  showAnon = () => {
    this.setState({
    })
  }
  handleInputOffer = () => {
    this.fileInput.current.click();
  }
  render(){
    // console.log(this.state.data)
    return(
      <div>
        <CSVReader
          onFileLoaded={this.handleReadCSV}
          inputRef={this.fileInput}
          style={{display: 'none'}}
          onError={this.handleonError}
          configOptions={{header: true /* Header row support */ }}
        />
        <button onClick={this.handleInputOffer}>Import</button>
        <button onClick={this.hideAnon}>Filter Anonymous Donations</button>
        <button onClick={this.showAnon}>Show Anonymous Donations</button>
        <JsonTable rows = {this.state.data} />
        <p>Total Donation Amount ${this.state.totalDonations}</p>
      </div>
    )
  }
}

export default Parser;