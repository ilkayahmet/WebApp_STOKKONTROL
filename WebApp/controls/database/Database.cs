using System.Data;
using System.Data.SqlClient;
using WebApp.controls.database;

namespace WebApp.controls
{
    public static class Database
    {
        public static SqlConnection Connection
        {
            get { return new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["stoktakip"].ConnectionString); }
        }

        public static object ExecuteScalar(Proc procedure)
        {
            SqlConnection connection = Connection;
            try
            {
                SqlCommand cmd = createCommand(connection, procedure);
                connection.Open();
                object returnValue = cmd.ExecuteScalar();
                connection.Close();
                return returnValue;
            }
            catch (System.Exception)
            {

                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    
                }
                return null;
            }
            
            
        }

        public static DataTable FillTable(Proc procedure)
        {
            SqlCommand cmd = createCommand(Connection, procedure);
            DataTable returnTable = new DataTable();
            try
            {
                new SqlDataAdapter(cmd).Fill(returnTable);
            }
            catch (System.Exception)
            {

                if (Connection.State == ConnectionState.Open)
                {
                    Connection.Close();

                }
            }
            
            return returnTable;
        }

        public static DataSet FillSet(Proc procedure)
        {
            SqlCommand cmd = createCommand(Connection, procedure);
            cmd.CommandTimeout = 600;
            DataSet returnSet = new DataSet();
            try
            {
                new SqlDataAdapter(cmd).Fill(returnSet);
            }
            catch (System.Exception)
            {

                if (Connection.State == ConnectionState.Open)
                {
                    Connection.Close();

                }
            }
            return returnSet;
        }

        private static SqlCommand createCommand(SqlConnection connection, Proc procedure)
        {
            string executable = procedure.Name + " " + string.Join(",", procedure.Params.Keys);
            SqlCommand cmd = new SqlCommand(executable, connection);
            foreach (string parameterName in procedure.Params.Keys)
                if (procedure.Params[parameterName].GetType() != typeof(DataTable))
                {
                    cmd.Parameters.AddWithValue(parameterName, procedure.Params[parameterName]);
                }
                else
                {
                    SqlParameter p = cmd.Parameters.Add(new SqlParameter(parameterName, SqlDbType.Structured));
                    p.TypeName = ((DataTable)procedure.Params[parameterName]).TableName;
                    p.Value = (DataTable)procedure.Params[parameterName];
                }
            return cmd;
        }
    }
}