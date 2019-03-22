import React, { Component } from 'react';

export class CustomerList extends Component {

    constructor(props) {
        super(props);
       
        this.state = {
            customersPaginated: { customers: [], totalPages: 1 }, loading: true, currCustomer: Utils.GetEmptyCustomer() };

        fetch('/api/Data/GetCustomers')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ customersPaginated: data, loading: false  });
                //this.setState({ customersPaginated: { customers: [{ customerId: 1, name: 'shibu', email: 'shibut@microsoft.com', city: 'hyderabad' }], totalPages: 1 }, loading: false });
            });


        
    }

    static renderCustomerListTable(cs) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Action</th>

                       
                    </tr>
                </thead>
                <tbody>
                    {cs.map(c =>
                        <tr key={c.customerId}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.address}</td>
                            <td>{c.city}</td>
                            <td>{c.state}</td>
                            <td>{c.country}</td>
                            <td><a onClick={this.fillFormForUpdate(c)} >Edit</a> </td>

                            

                        </tr>
                    )}
                </tbody>

            </table>
        );

    }


    render() {

        let cs = this.state.customersPaginated.customers;
       
        return (
            <div>
                <div>
                    <h1>Customers</h1>
                    <p>This component demonstrates fetching data from the server.</p>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Country</th>
                                <th>Action</th>


                            </tr>
                        </thead>
                        <tbody>
                            {cs.map(c =>
                                <tr key={c.customerId}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.address}</td>
                                    <td>{c.city}</td>
                                    <td>{c.state}</td>
                                    <td>{c.country}</td>
                                    <td><a onClick={()=>this.fillFormForUpdate(c)} >Edit</a> </td>



                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
                <AddEditCustomer customer={this.state.currCustomer}
                    actionSubmit={this.AddUpdate.bind(this)}
                    actionReset={this.ResetForm.bind(this)}
                    actionEventHandlerUpdate={this.UpdateCurrentCustomer.bind(this)}
                />
            </div>
        );

    }

    UpdateCurrentCustomer(event) {
        var cust = this.state.currCustomer;

        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case "name":
                cust.name = value;
                break;

            case "email":
                cust.email = value;
                break;

            case "address":
                cust.address = value;
                break;

            case "city":
                cust.city = value;
                break;

            case "country":
                cust.country = value;
                break;

            case "state":
                cust.state = value;
                break;

            default:
                return;

        }

        this.setState({ currCustomer: cust });
       
       
        


    }

    AddUpdate() {

        var c = this.state.currCustomer;
        console.log(c);
        console.log(JSON.stringify(c));
        var isUpdate = c.customerId > 0;
        if (c.name == '') return;

        var cs = this.state.customersPaginated.customers;

        fetch(
            '/api/Data/CreateUpdateCust',
            {
                method: 'post',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(c)
            }).then(response => response.json())
            .then(data => {
                if (isUpdate) {
                    for (var i = 0; i < cs.length; i++) {
                        if (cs[i].customerId == c.customerId) {
                            cs[i] = data[0];
                        }
                    }
                } else {
                    cs.upshift(data[0]);
                    cs.pop();
                }

                var cp = { customers: cs, totalPages: this.state.customersPaginated.totalPages };
                this.setState({ customersPaginated: cp });

            });


    }


    ResetForm() {
        this.setState({ currCustomer: Utils.GetEmptyCustomer() });
    }

     fillFormForUpdate(c) {
        var temp = Utils.GetEmptyCustomer();
        temp.customerId = c.customerId;
        temp.address = c.address;
        temp.city = c.city;
        temp.country = c.country;
        temp.state = c.state;
        temp.email = c.email;
        temp.name = c.name;

        this.setState({ currCustomer: temp });
        this.render();
    }


}

class Utils extends Component {
    static GetEmptyCustomer() {
        var c = { customerId: 0, name: '', address: '', email: '', city: '', state: '', country: '' }
        return c;
    }
}


export class AddEditCustomer extends Component {
    constructor(props) {
        super(props);

    
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
      
        this.props.actionEventHandlerUpdate(event);
    }

    render() {
        //this.setState({ editedCustomer: this.props.customer })
        var c = this.props.customer;
        return (
            <div>
            <div>
                    name: <input name="name" type="text" value={c.name} onChange={this.handleChange} />
            </div>

            <div>
                    address: <input name="address" type="text" value={c.address} onChange={this.handleChange} />
            </div>

            <div>
                    city: <input name="city" type="text" value={c.city} onChange={this.handleChange} />
            </div>
            <div>
                    state: <input name="state" type="text" value={c.state} onChange={this.handleChange} />
            </div>

            <div>
                    country: <input name="country" type="text" value={c.country} onChange={this.handleChange} />
            </div>

            <div>
                    email: <input name="email" type="text" value={c.email} onChange={this.handleChange} />
            </div>

                <div>
                    <a onClick={()=> this.ResetForm()}> Reset </a>
                    <button onClick={()=>this.AddData()}> Add/Update </button>
               </div>
            </div>
            );
    }

    AddData() {

        this.props.actionSubmit();
    }

    ResetForm() {
        this.props.actionReset(Utils.GetEmptyCustomer());
    }
}