import React from "react";
import axios from "axios";
import "../style/LeadDashboard.css";

const initialState = {
  first_name: "",
  last_name: "",
  mobile: "",
  email: "",
  location_type: "",
  location_string: "",
  first_name_error: "",
  last_name_error: "",
  mobile_error: "",
  email_error: "",
  location_type_error: "",
  location_string_error: "",
  id:""
};

class LeadsManagementDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialState: initialState,
      tableData: [],
      communication: "",
    };
  }

  componentDidMount = () => {
    this.getAllLeads();
  };

  getAllLeads = () =>{
    axios.get("http://3.95.29.10:4002/api/leads/").then((response) => {
        this.setState({ tableData: response.data });
      });
  }

  handleChangeAll = (event) => {
    const isCheckbox = event.target.type === "checkbox";
    this.setState({
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value,
    });
    event.preventDefault();
  };

  validateForm = () => {
    let first_name_error = "";
    let last_name_error = "";
    let mobile_error = "";
    let email_error = "";
    let location_type_error = "";
    let location_string_error = "";

    if (!this.state.first_name) {
      first_name_error = "First Name is required!";
    }

    if (!this.state.last_name) {
      last_name_error = "Last Name is required!";
    }

    if (!this.state.mobile) {
      mobile_error = "Mobile Number is required!";
    }

    if (!this.state.email) {
      email_error = "Email Id is required!";
    }

    if (!this.state.location_type) {
      location_type_error = "Location Type is required!";
    }

    if (!this.state.location_string) {
      location_string_error = "Location String is required!";
    }

    if (first_name_error || last_name_error || mobile_error || email_error || location_type_error || location_string_error) {
      this.setState({ first_name_error, last_name_error, mobile_error, email_error, location_type_error, location_string_error,});
      return false;
    }

    return true;
  };

  addLeadForm = () => {
    this.setState(initialState);
    document.getElementsByClassName("add_lead_form")[0].style.display = "block";
  };

  updateLeadForm = (id,communication) => {
    this.setState({id});
    document.getElementsByClassName("update_lead_form")[0].style.display = "block";  
    this.setState({communication})
  };

  deleteLeadForm = (id) => {
    this.setState({id});
    document.getElementsByClassName("delete_lead_form")[0].style.display = "block";
  };

  closeAddLeadForm = () => {
    this.setState(initialState);
    document.getElementsByClassName("add_lead_form")[0].style.display = "none";
  };

  closeUpdateLeadForm = () => {
    this.setState(initialState); 
    document.getElementsByClassName("update_lead_form")[0].style.display = "none";
  };

  closeDeleteLeadForm = () => {
    document.getElementsByClassName("delete_lead_form")[0].style.display = "none";
  };

  addNewLead = (event) => {
    event.preventDefault();
    const isValid = this.validateForm();

    if (isValid) {
      const leadsData = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        mobile: this.state.mobile,
        email: this.state.email,
        location_type: this.state.location_type,
        location_string: this.state.location_string,
      };

      axios.post("http://3.95.29.10:4002/api/leads/", leadsData)
        .then((response) => {
          console.log(response);
          alert('Leads added successfully');
          if(response.status===201){
            this.getAllLeads()}
          //Clear form
          this.setState(initialState);  
          this.closeAddLeadForm();
        })
        .catch((err) => {
          console.log(err.response);
          this.setState({email_error: err.response.data.email })
          this.validateForm()
        });
    }
  };

  updateLead = () => {
    let dataToUpdate = {
      communication: this.state.communication,
    };
    axios.put(`http://3.95.29.10:4002/api/mark_lead/${this.state.id}`, dataToUpdate)
      .then((response) => {
      console.log(response)
      if(response.status===202){
        this.getAllLeads()
      }
    })
    this.closeUpdateLeadForm();
  }
  
  deleteLead = () => {
      let data = this.state.tableData.filter(x => x.id === this.state.id);
      axios.delete(`http://3.95.29.10:4002/api/leads/${this.state.id}`, {data
      })
      .then((response) =>{
          console.log(response);
          if(response.status===204){
            this.getAllLeads()
          }
      })
      this.closeDeleteLeadForm()
  }

  render() {
    return (
            <div>
            <button className="add_lead_modal_btn" onClick={this.addLeadForm}>Add Lead</button>
            <table className="leads_table">
              <tbody>
                <th className="row-heading">Name</th>
                <th className="row-heading">Email</th>
                <th className="row-heading">Mobile Num</th>
                <th className="row-heading">Location Type</th>
                <th className="row-heading">Location String</th>
                <th className="row-heading">Action</th>
              </tbody>
              {this.state.tableData.map((data) => (
                <tbody className="row-data">
                  <td className="row-info">{data.first_name + " " + data.last_name}</td>
                  <td className="row-info">{data.email}</td>
                  <td className="row-info">{data.mobile}</td>
                  <td className="row-info">{data.location_type}</td>
                  <td className="row-info">{data.location_string}</td>
                  <td className="row-info">
                  <button
                      className="update_lead_modal_btn"
                      onClick={()=>this.updateLeadForm(data.id,data.communication)}>
                      Mark Update
                  </button>
                  <button className="delete_lead_modal_btn" onClick={()=>this.deleteLeadForm(data.id)}>Delete</button>
                  </td>
                </tbody>
              ))}
            </table>

            <div className="modal add_lead_form">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Lead</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span
                        className="cross-button"
                        onClick={this.closeAddLeadForm}
                        aria-hidden="true">&times;
                      </span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-row">
                        <div className="col">
                          <label>First Name</label>
                          <span className="error-star">*</span>
                          <input value={this.state.first_name}
                            type="text"
                            className="form-control"
                            name="first_name"
                            onChange={this.handleChangeAll}/>
                          <div className="invalid-input">
                            {this.state.first_name_error}
                          </div>
                        </div>

                        <div className="col">
                          <div className="input-area">
                            <label>Last Name</label>
                            <span className="error-star">*</span>
                            <input value={this.state.last_name}
                              type="text"
                              className="form-control"
                              name="last_name"
                              onChange={this.handleChangeAll}/>
                            <div className="invalid-input">
                              {this.state.last_name_error}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="col">
                          <label>Email Address</label>
                          <span className="error-star">*</span>
                          <input value={this.state.email}
                            type="text"
                            className="form-control"
                            name="email"
                            onChange={this.handleChangeAll}/>
                          <div className="invalid-input">
                            {this.state.email_error}
                          </div>
                        </div>

                        <div className="col">
                          <div className="input-area">
                            <label>Mobile</label>
                            <span className="error-star">*</span>
                            <input value={this.state.mobile}
                              type="text"
                              className="form-control"
                              name="mobile"
                              onChange={this.handleChangeAll}/>
                            <div className="invalid-input">
                              {this.state.mobile_error}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="col">
                          <label>Location Type</label>
                          <span className="error-star">*</span>
                          <select value={this.state.location_type}
                            className="form-control"
                            name="location_type"
                            onChange={this.handleChangeAll}>
                            <option></option>
                            <option value="Country">Country</option>
                            <option value="City">City</option>
                          </select>
                          <div className="invalid-input">
                            {this.state.location_type_error}
                          </div>
                        </div>
                        
                        <div className="col">
                          <div className="input-area">
                            <label>Location String</label>
                            <span className="error-star">*</span>
                            <input value={this.state.location_string}
                              type="text"
                              className="form-control"
                              name="location_string"
                              onChange={this.handleChangeAll}/>
                            <div className="invalid-input">{this.state.location_string_error}</div>
                              <div className="modal-footer">
                              <button type="button" className="btn" onClick={this.closeAddLeadForm}> Close</button>
                              <input
                                type="submit"
                                onClick={this.addNewLead}
                                className="btn btn-secondary add_lead_btn"
                                data-dismiss="modal"
                                value="Save"/>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal update_lead_form">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Mark Communication</h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close">
                      <span
                        aria-hidden="true"
                        onClick={this.closeUpdateLeadForm}>
                        &times;
                      </span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Communication</label>
                      <textarea
                        className="form-control comm-area"
                        name="communication"
                        value={this.state.communication?this.state.communication:''}
                        onChange={this.handleChangeAll}></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn close-button"
                      onClick={this.closeUpdateLeadForm}>
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn save-button update_lead_btn"
                      onClick={this.updateLead}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal delete_lead_form" tabindex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Do you wish to delete this lead?</h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close">
                      <span aria-hidden="true" onClick={this.closeDeleteLeadForm}>&times;</span>
                    </button>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn delete_lead_btn" onClick={this.deleteLead}>
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary cancel_btn"
                      onClick={this.closeDeleteLeadForm}
                      data-dismiss="modal">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    }

export default LeadsManagementDashboard;