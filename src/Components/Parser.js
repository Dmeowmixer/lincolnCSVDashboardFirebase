import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';

import firebase from './Firebase';

const JsonTable = require('ts-react-json-table');
const db = firebase.database().ref('lincolnViewer');
class Parser extends Component {
  constructor(props){
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      data: [],
      totalDonations: null,
      hideDonations: false
    }
    this.handleReadCSV = this.handleReadCSV.bind(this);
    this.getTotalDonations = this.getTotalDonations.bind(this);
  }

  componentDidMount(){
    // let total = 0;
    db.on('value', (snapshot) => {
      this.setState({
        data: snapshot.val()
      }, this.getTotalDonations)
    })
  }

  getTotalDonations(){
    // const { data } = this.state;
    const data = this.state.data;
    if(!data){
      return;
    }
    const totalDonations = data
      .filter(x => x.donation_amount && x.donor_id !== "")
      .reduce((acc, curr) => {
        return acc += parseFloat(curr.donation_amount)
      }, 0)
    this.setState({
      totalDonations: totalDonations.toFixed(2)
    });
  }

// On file upload
  handleReadCSV = (snapshot) => {
    // const { data: stateDat } = this.state;
    const data = this.state.data.concat(snapshot.data)
    // const data = stateData.concat(snapshot.data);

    db.set(data)

    this.setState({
      data: data
    }, this.getTotalDonations)
  }
  handleonError = (err, file, inputEle, reason) => {
    
    console.log(err);
  }

  hideAnon = () => {
    if(!this.state.hideDonations){
      console.log('clicked true');
      this.setState({
        hideDonations: true
      })
      let totalRemoved = 0;
      if(this.state.data !== null){
        this.setState({
          data: this.state.data.filter(x => {
            if(x.donor_name === ""){
              totalRemoved += parseFloat(x.donation_amount);
            }
            return x.donor_name !== "";
          })
          // totalDonations: this.state.totalDonations-totalRemoved
        }, this.getTotalDonations)
      }
    }else{
      console.log('clicked falsey')
      db.on('value', (snapshot) => {
        this.setState({
          data: snapshot.val(),
          hideDonations: false
        }, this.getTotalDonations)
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
        <JsonTable rows = {this.state.data} />
        <p>Total Donation Amount ${this.state.totalDonations}</p>
      </div>
    )
  }
}

export default Parser;


// ToDo
 // Webhook to Slack