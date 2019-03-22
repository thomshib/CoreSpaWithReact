using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using CoreSpaWithReactApp.Models;


namespace CoreSpaWithReactApp.Controllers
{
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        private IConfiguration _config;

        public DataController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("[action]")]
        public CustomersPaginated GetCustomers()
        {
            string connectionString = _config.GetSection("Configuration").GetSection("ConnectionString").Value;
            List<Customer> custList = new List<Customer>();
            int totalPages = 0;


            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_GetCustomers", conn))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    conn.Open();

                    SqlDataReader reader = command.ExecuteReader();
                    reader.Read();
                    totalPages = Convert.ToInt32(reader["totalPages"]);

                    reader.NextResult();

                    while (reader.Read())
                    {
                        custList.Add(new Customer()
                        {
                            CustomerId = Convert.ToInt32(reader["CustomerId"]),
                            Name = reader["Name"].ToString(),
                            City = reader["City"].ToString(),
                            State = reader["State"].ToString(),
                            Country = reader["Country"].ToString(),
                            Address = reader["Address"].ToString(),
                            Email = reader["Email"].ToString()
                        });
                    }

                }

                return new CustomersPaginated() { TotalPages = totalPages, Customers = custList };


            }

        }

        [HttpPost("[action]")]
        public IEnumerable<Customer> CreateUpdateCust([FromBody]Customer c)
        {
            string connectionString = _config.GetSection("Configuration").GetSection("ConnectionString").Value;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_CreateOrUpdateCustomer", conn))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    conn.Open();

                    command.Parameters.Add("@customerId", SqlDbType.NVarChar).Value = c.CustomerId;
                    command.Parameters.Add("@name", SqlDbType.NVarChar).Value = c.Name;
                    command.Parameters.Add("@address", SqlDbType.NVarChar).Value = c.Address;
                    command.Parameters.Add("@city", SqlDbType.NVarChar).Value = c.City;
                    command.Parameters.Add("@state", SqlDbType.NVarChar).Value = c.State;
                    command.Parameters.Add("@country", SqlDbType.NVarChar).Value = c.Country;
                    command.Parameters.Add("@email", SqlDbType.NVarChar).Value = c.Email;
                    SqlDataReader reader = null;
                    reader = command.ExecuteReader();
                    reader.Read();
                    c.CustomerId = Convert.ToInt32(reader["new_id"].ToString());
                }
            }

            List<Customer> listCust = new List<Customer>();
            listCust.Add(c);
            return listCust;


        }
    }
}
