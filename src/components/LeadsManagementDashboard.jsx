import React from 'react';
import '../style/LeadDashboard.css';
import axios from 'axios';

class LeadsManagementDashboard extends React.Component{

    constructor(props) {
        super(props)
    
        this.state = {
            tableData: []
        }
    }
    
    componentDidMount = () =>
    {
        axios.get('http://3.95.29.10:4000/api/leads/')
        .then((response) => {
            this.setState({tableData: response.data})
            console.log(this.state.tableData);
        });
       
        
    }

    render(){
        
        return (
            <div>
            <button className="add_lead_model_button">Add Lead</button>
            <table className="leads_table">
            <tr>   
            <th className="row">Name</th>
            <th className="row">Email</th> 
            <th className="row">Mobile Num</th>
            <th className="row">Location Type</th>
            <th className="row">Location String</th> 
            <th className="row">Action</th>
            </tr>
            {this.state.tableData.map((data)=>(
            <tr className="row-data">
            <td>{data.first_name +" " +data.last_name}</td>
            <td>{data.email}</td>
            <td>{data.mobile}</td>
            <td>{data.location_type}</td>
            <td>{data.location_string}</td>
            <td><button className="update_lead_modal_btn">Mark Update</button>
            <button className="delete_lead_modal_btn">Delete</button></td>
            </tr>
            ))}
            </table>
            </div>
        )
    }
}

export default LeadsManagementDashboard;