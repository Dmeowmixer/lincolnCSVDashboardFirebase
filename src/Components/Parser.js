import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse';
import firebase from './Firebase';
import { Button, Table } from 'reactstrap';


const db = firebase.database().ref('lincoln');
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
        <Button color="danger" onClick={this.handleInputOffer}>Import</Button>
        <Button color="danger" onClick={this.hideAnon}>Filter Anonymous Donations</Button>
        <h1>Total Donation Amount ${this.state.totalDonations}</h1>
        <Table>
          <thead>
            <tr>
              <th>Donation Amount</th>
              <th>Donor Address</th>
              <th>Donor Email</th>
              <th>Donor Gender</th>
              <th>Donor ID</th>
              <th>Donor Name</th>
            </tr>
          </thead>
          <tbody>
              {this.state.data.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{data.donation_amount}</td>
                    <td>{data.donor_address}</td>
                    <td>{data.donor_email}</td>
                    <td>{data.donor_gender}</td>
                    <td>{data.donor_id}</td>
                    <td>{data.donor_name}</td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default Parser;