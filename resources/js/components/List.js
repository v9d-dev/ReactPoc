import React, { Component } from 'react'
import { Grid, Container, Button, Snackbar } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';
import { Redirect } from "react-router-dom";
import Header from './Header';
import Alert from '@material-ui/lab/Alert';
import SimpleReactValidator from 'simple-react-validator';


const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'hide',
  },
  table: {
    minWidth: 340,
  },
  tableCell: {
    paddingRight: 4,
    paddingLeft: 5
  },
  table: {
    minWidth: 700,
  },
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
});



class List extends Component {
  constructor(props) {
    super(props)
    this.validator = new SimpleReactValidator();
    this.state = {
      isDeleteModal: false,
      isAddEditModal: false,
      isAlertModal: false,
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      email: "",
      listData: [],
      deleteId: 0,
      editData:{},
      editId:0,
      FormHeading:'Add',
      isSuccess:false,
      severity:"success",
      alertMsg:""
    }
    //this.handleClickOpen = this.handleClickOpen.bind(this);
   // this.createData = this.createData.bind(this);
    this.handelAddEditModal = this.handelAddEditModal.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleAlertModal = this.handleAlertModal.bind(this);
    this.getListData = this.getListData.bind(this);
    this.DeleteData = this.DeleteData.bind(this);
    this.clearState = this.clearState.bind(this);
    this.handelSubmit = this.handelSubmit.bind(this);
    this.handleCloseMsg = this.handleCloseMsg.bind(this);
  }

  handelAddEditModal(id) {

    let stateCopy = Object.assign({}, this.state);
    stateCopy['isAddEditModal'] = !this.state.isAddEditModal;
    if(id != 'undefined' && id != "" && id > 0){
      stateCopy['FormHeading'] = "Update";
    }
    this.setState(stateCopy,()=>{

      if(id != 'undefined' && id != "" && id > 0){
        this.getEditData(id);
      }
      this.clearState();
    });

  }

  handleCloseMsg(){

    let stateCopy = Object.assign({}, this.state);
    stateCopy["isSuccess"] = false;
    this.setState(stateCopy);
  }
  getEditData(editId){
    //alert("id =>"+editId);
    let token = localStorage.getItem('ACCESS_TOKEN');
    let API_URL = localStorage.getItem('API_URL');

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }


    axios.get(API_URL + '/student/'+editId, { headers: headers })
      .then(response => {
        //this.setState({loaded:true})
        if (response.status == 200) {
          let editData = response.data.data;
          let stateCopy = Object.assign({}, this.state);
          
          stateCopy["first_name"] = editData.first_name;
          stateCopy["last_name"] = editData.last_name;
          stateCopy["phone"] = editData.phone;
          stateCopy["address"] = editData.address;
          stateCopy["email"] = editData.email;
          stateCopy["editId"] = editData.id

          this.setState(stateCopy);
          //response.data.data

        }
      });

  }

  handleDeleteConfirm(id) {

    let stateCopy = Object.assign({}, this.state);
    stateCopy['isDeleteModal'] = !this.state.isDeleteModal;
    stateCopy['deleteId'] = id;
    this.setState(stateCopy);
  }

  handleAlertModal() {
    let stateCopy = Object.assign({}, this.state);
    stateCopy['isAlertModal'] = !this.state.isAlertModal;
    this.setState(stateCopy),() =>{
      handelAddEditModal(0);
      this.getListData();
    };
  }


  handleFieldChange(e) {
    //alert(e.target.value);
    
    let stateCopy = Object.assign({}, this.state);
    stateCopy[e.target.name] = e.target.value;
    this.setState(stateCopy);
   
  }

  handelSubmit(e) {
    e.preventDefault();

    let API_URL = localStorage.getItem('API_URL');
    //let APP_URL = localStorage.getItem('APP_URL');

    let formData = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,

    }

    let token = localStorage.getItem('ACCESS_TOKEN');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }

    if (!this.validator.allValid()) {
      this.validator.showMessages();
      this.forceUpdate();
      return false;
    }

    if (this.state.editId != "undefined" && this.state.editId > 0) {
      //formData.
      axios.patch(API_URL + '/student/' + this.state.editId, formData, { headers: headers })
        .then(response => {
          if (response.status == 200) {
            //this.handleAlertModal();
            let stateCopy = Object.assign({}, this.state);
            stateCopy['alertMsg'] = "Student Update Successfully !";
            stateCopy['isSuccess'] = true
            this.setState(stateCopy, () => {
              this.handelAddEditModal();
              this.getListData();
              setTimeout(() => { this.setState({ isSuccess: false }) }, 4000);
      
            });
          }
        });

    } else {

      axios.post(API_URL + '/student', formData, { headers: headers })
        .then(response => {
          if (response.status == 201) {
            // this.handleAlertModal();
            let stateCopy = Object.assign({}, this.state);
            stateCopy['alertMsg'] = "Student Add Successfully !";
            stateCopy['isSuccess'] = true
            this.setState(stateCopy, () => {
              this.handelAddEditModal();
              this.getListData();
              setTimeout(() => { this.setState({ isSuccess: false }) }, 4000);
            });
          }
        });

    }
  }

  DeleteData() {

    let token = localStorage.getItem('ACCESS_TOKEN');
    let API_URL = localStorage.getItem('API_URL');

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }


    axios.delete(API_URL + '/student/' + this.state.deleteId, { headers: headers })
      .then(response => {
        if (response.status == 204) {
            this.getListData();
        }
      });


  }

  getListData() {

    let token = localStorage.getItem('ACCESS_TOKEN');
    let API_URL = localStorage.getItem('API_URL');

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }


    axios.get(API_URL + '/student', { headers: headers })
      .then(response => {
        //this.setState({loaded:true})
        if (response.status == 200) {

          let stateCopy = Object.assign({}, this.state);
          stateCopy["listData"] = response.data.data;
          this.setState(stateCopy);

        }
      });

  }

  clearState(){
    
     let stateCopy = Object.assign({}, this.state);
     stateCopy['first_name'] = "";
     stateCopy['last_name'] = "";
     stateCopy['email'] = "";
     stateCopy['phone'] = "";
     stateCopy['address'] = "";
     stateCopy['editId'] = 0;
     this.setState(stateCopy);
     this.validator.hideMessages();
     
    
    }

  componentDidMount() {

    this.getListData();
  }

  render() {
     console.log('state', this.state);
    const { classes } = this.props;
    const data = this.state.listData;
    let i = 1;
    const access_token = localStorage.getItem('ACCESS_TOKEN');
    if (access_token == 'false' || access_token == 'undefined' || access_token == 'null' || access_token == "") {
      return <Redirect to="/login" />;
    }
 
    return (
      <div>
        <Header />
        <Container component="main" >

        {/* <Snackbar open={this.state.isSuccess} autoHideDuration={4000} onClose={this.handleCloseMsg}> */}
       {this.state.isSuccess == true &&
        <Alert onClose={this.handleCloseMsg} severity={this.state.severity}>
          {this.state.alertMsg}
        </Alert>
        }
       {/* </Snackbar> */}


          <div className="App">

            <Button variant="outlined" className={this.props.classes.root} color="primary" onClick={() => this.handelAddEditModal(0)} modalAction="ADD" >
              Create Student
      </Button>
          </div>

          <Paper className={this.props.classes.root}>
            <Table className={this.props.classes.table}>
              <TableHead>
                <TableRow>
                  {/* <TableCell className={this.props.classes.tableCell}>#</TableCell> */}
                  <TableCell className={this.props.classes.tableCell}>First Name</TableCell>
                  <TableCell className={this.props.classes.tableCell}>Last Name</TableCell>
                  <TableCell className={this.props.classes.tableCell}>E-mail</TableCell>
                  <TableCell className={this.props.classes.tableCell}> Contact No.</TableCell>
                  <TableCell className={this.props.classes.tableCell}> Address</TableCell>
                  <TableCell className={this.props.classes.tableCell}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(n => {

                  return (
                    <TableRow key={n.id}>
                      {/* <TableCell className={this.props.classes.tableCell}>{i}</TableCell> */}
                      <TableCell className={this.props.classes.tableCell}>{n.first_name}</TableCell>
                      <TableCell className={this.props.classes.tableCell}>{n.last_name}</TableCell>
                      <TableCell className={this.props.classes.tableCell}>{n.email}</TableCell>
                      <TableCell className={this.props.classes.tableCell}>{n.phone}</TableCell>
                      <TableCell className={this.props.classes.tableCell}>{n.address}</TableCell>
                      <TableCell className={this.props.classes.tableCell}> <EditIcon onClick={() => this.handelAddEditModal(n.id)} modalAction="EDIT" editId={n.id} /> &nbsp;&nbsp;&nbsp;&nbsp;<DeleteIcon onClick={() => this.handleDeleteConfirm(n.id)} /></TableCell>
                    </TableRow>
                  );

                })}
              </TableBody>
            </Table>
          </Paper>


          <Dialog open={this.state.isAddEditModal} onClose={() => this.handelAddEditModal(0)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{this.state.FormHeading} Student</DialogTitle>

            <DialogContent>
              <Container component="main" maxWidth="xs">
                <form className={classes.form} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="fname"
                        name="first_name"
                        variant="outlined"
                        required
                        fullWidth
                        id="first_name"
                        label="First Name"
                        autoFocus
                        onChange={this.handleFieldChange}
                        value={this.state.first_name}

                      />
                       {this.validator.message('first_name', this.state.first_name, 'required', { className: 'text-danger' })}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="last_name"
                        autoComplete="lname"
                        autoFocus
                        onChange={this.handleFieldChange}
                        value={this.state.last_name}
                      />
                      {this.validator.message('last_name', this.state.last_name, 'required', { className: 'text-danger' })}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={this.handleFieldChange}
                        value={this.state.email}
                      />
                      {this.validator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="phone"
                        label="Contact Number"
                        name="phone"
                        autoComplete="mobile"
                        autoFocus
                        onChange={this.handleFieldChange}
                        value={this.state.phone}
                      />
                       {this.validator.message('Contact_Number', this.state.phone, 'required|phone', { className: 'text-danger' })}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="address"
                        label="Address"
                        id="address"
                        autoComplete="current-address"
                        autoFocus
                        onChange={this.handleFieldChange}
                        value={this.state.address}
                      />
                      {this.validator.message('Address', this.state.address, 'required', { className: 'text-danger' })}
                    </Grid>

                  </Grid>

                  <DialogActions>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={this.handelSubmit}
                    >
                      Submit
                    </Button>
                  </DialogActions>

                  
                </form>
              </Container>
            </DialogContent>
          </Dialog>
          <ConfirmDialog
            title="Delete Student?"
            open={this.state.isDeleteModal}
            setOpen={this.handleDeleteConfirm}
            onConfirm={this.DeleteData}
          >
            Are you sure you want to delete this Student?
          </ConfirmDialog>

          <AlertDialog
            title="Success"
            open={this.state.isAlertModal}
            setOpen={this.handleAlertModal}
            onConfirm={this.handleAlertModal}
          >
            Successfully Added!!
          </AlertDialog>


        </Container>
      </div>
    )
  }
}

export default withStyles(styles)(List);