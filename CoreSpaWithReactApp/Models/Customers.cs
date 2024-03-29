﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreSpaWithReactApp.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Email { get; set; }
        

    }

    public class CustomersPaginated
    {
        public List<Customer> Customers;
        public int TotalPages;
    }
}
