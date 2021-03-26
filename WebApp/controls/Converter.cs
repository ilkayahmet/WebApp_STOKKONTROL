using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Web;

namespace WebApp.controls
{
    public static class Converter
    {
        public static Dictionary<int, string> DataTableToDictionary(DataTable dt, string keyName, string valueName)
        {
            Dictionary<int, string> result = new Dictionary<int, string>();
            foreach (DataRow row in dt.Rows)
                result.Add(Convert.ToInt32(row[keyName]), row[valueName].ToString());
            return result;
        }
        
        public static string DataRowToJSON(DataRow row, bool includeCurlyBraces = true)
        {
            string JSONData = string.Empty;
            List<string> colList = new List<string>();
            foreach (DataColumn col in row.Table.Columns)
            {
                string cell = "\"" + col.ColumnName + "\":";
                if (col.DataType == typeof(string) || col.DataType == typeof(String))
                    cell += "\"" + row[col.ColumnName] + "\"";
                else if (col.DataType == typeof(DateTime))
                    cell += "\"" + ((DateTime)row[col.ColumnName]).ToString("o") + "\"";
                else if (col.DataType == typeof(Decimal) || col.DataType == typeof(decimal) || col.DataType == typeof(float))
                    cell += row[col.ColumnName].ToString().Replace(',', '.');
                else if (col.DataType == typeof(bool))
                    cell += (bool)row[col.ColumnName] ? "true" : "false";
                else
                    cell += row[col.ColumnName];
                colList.Add(cell);
            }
            JSONData += string.Join(",", colList);
            if (includeCurlyBraces)
                JSONData = "{" + JSONData + "}";
            return JSONData;
        }
        public static string DataRowToJSON(DataRow row, string keyName)
        {
            string JSONData;
            if (row.Table.Columns[keyName].DataType == typeof(string) || row.Table.Columns[keyName].DataType == typeof(String))
                JSONData = "\"" + row[keyName] + "\"";
            else if (row.Table.Columns[keyName].DataType == typeof(DateTime))
                JSONData = "\"" + ((DateTime)row[keyName]).ToString("o") + "\"";
            else if (row.Table.Columns[keyName].DataType == typeof(Decimal) || row.Table.Columns[keyName].DataType == typeof(decimal) || row.Table.Columns[keyName].DataType == typeof(float))
                JSONData = row[keyName].ToString().Replace(',', '.');
            else if (row.Table.Columns[keyName].DataType == typeof(bool))
                JSONData = (bool)row[keyName] ? "true" : "false";
            else
                JSONData = row[keyName].ToString();
            JSONData += ":";
            List<string> colList = new List<string>();
            foreach (DataColumn col in row.Table.Columns)
            {
                if (col.ColumnName != keyName)
                {
                    string cell = "\"" + col.ColumnName + "\":";
                    if (col.DataType == typeof(string) || col.DataType == typeof(String))
                        cell += "\"" + row[col.ColumnName] + "\"";
                    else if (col.DataType == typeof(DateTime))
                        cell += "\"" + ((DateTime)row[col.ColumnName]).ToString("o") + "\"";
                    else if (col.DataType == typeof(Decimal) || col.DataType == typeof(decimal) || col.DataType == typeof(float))
                        cell += row[col.ColumnName].ToString().Replace(',', '.');
                    else if (col.DataType == typeof(bool))
                        cell += (bool)row[col.ColumnName] ? "true" : "false";
                    else
                        cell += row[col.ColumnName];
                    colList.Add(cell);
                }
            }
            JSONData += "{" + string.Join(",", colList) + "}";
            return JSONData;
        }
        public static string DataRowToJSON(DataRow row, string keyName, string valueName)
        {
            string JSONData;
            if (row.Table.Columns[keyName].DataType == typeof(string) || row.Table.Columns[keyName].DataType == typeof(String))
                JSONData = "\"" + row[keyName] + "\"";
            else if (row.Table.Columns[keyName].DataType == typeof(DateTime))
                JSONData = "\"" + ((DateTime)row[keyName]).ToString("o") + "\"";
            else if (row.Table.Columns[keyName].DataType == typeof(Decimal) || row.Table.Columns[keyName].DataType == typeof(decimal) || row.Table.Columns[keyName].DataType == typeof(float))
                JSONData = row[keyName].ToString().Replace(',', '.');
            else if (row.Table.Columns[keyName].DataType == typeof(bool))
                JSONData = (bool)row[keyName] ? "true" : "false";
            else
                JSONData = row[keyName].ToString();
            JSONData += ":";
            if (row.Table.Columns[valueName].DataType == typeof(string) || row.Table.Columns[valueName].DataType == typeof(String))
                JSONData += "\"" + row[valueName] + "\"";
            else if (row.Table.Columns[valueName].DataType == typeof(DateTime))
                JSONData += "\"" + ((DateTime)row[valueName]).ToString("o") + "\"";
            else if (row.Table.Columns[keyName].DataType == typeof(Decimal) || row.Table.Columns[keyName].DataType == typeof(decimal) || row.Table.Columns[keyName].DataType == typeof(float))
                JSONData += row[valueName].ToString().Replace(',', '.');
            else if (row.Table.Columns[keyName].DataType == typeof(bool))
                JSONData += (bool)row[valueName] ? "true" : "false";
            else
                JSONData += row[valueName];
            return JSONData;
        }

        public static string DataTableToJSON(DataTable dt)
        {
            if (dt.Rows.Count == 1 && dt.Columns.Contains("RESULT"))
                return "{\"RESULT\":" + dt.Rows[0]["RESULT"].ToString() + "}";
            dt.TableName = "LIST";
            string jsonArray = DataTableToJSONArray(dt);
            return "{\"RESULT\":1," + jsonArray + "}";
        }
        public static string DataTableToJSON(DataTable dt, string keyName, string varName)
        {
            List<string> resultList = new List<string>();
            foreach (DataRow row in dt.Rows)
            {
                string JSONData = DataRowToJSON(row, keyName);
                resultList.Add(JSONData);
            }
            return "var " + varName + "={" + string.Join(",", resultList) + "};";
        }
        public static string DataTableToJSON(DataTable dt, string keyName, string valueName, string varName)
        {
            List<string> resultList = new List<string>();
            foreach (DataRow row in dt.Rows)
            {
                string JSONData = DataRowToJSON(row, keyName, valueName);
                resultList.Add(JSONData);
            }
            return "var " + varName + "=" + "{" + string.Join(",", resultList) + "};";
        }

        public static string DataTableToJSONArray(DataTable dt)
        {
            List<string> resultList = new List<string>();
            foreach (DataRow row in dt.Rows)
            {
                string JSONData = DataRowToJSON(row);
                resultList.Add(JSONData);
            }
            return "\"" + dt.TableName + "\":[" + string.Join(",", resultList) + "]";
        }

        public static string DataSetToJSON(DataSet ds)
        {
            if (ds.Tables.Count == 1 && ds.Tables[0].Rows.Count == 1 && ds.Tables[0].Columns.Contains("RESULT"))
                return "{\"RESULT\":" + ds.Tables[0].Rows[0]["RESULT"].ToString() + "}";
            List<string> JSONArrayList = new List<string>();
            foreach (DataTable dt in ds.Tables)
            {
                string JSONArray = DataTableToJSONArray(dt);
                JSONArrayList.Add(JSONArray);
            }
            return "{\"RESULT\":1," + string.Join(",", JSONArrayList) + "}";
        }

        public static Dictionary<string,object> JSONToDictionary(string jstring)
        {
            System.Web.Script.Serialization.JavaScriptSerializer j = new System.Web.Script.Serialization.JavaScriptSerializer();
            object output = j.Deserialize(jstring, typeof(object));
            return (Dictionary<string, object>)output;
        }

        public static Dictionary<string,object> JSONToDictionary(System.IO.Stream stream)
        {
            var reader = new StreamReader(stream);
            string jstring = reader.ReadToEnd();
            return JSONToDictionary(jstring);
        }

        public static string QueryStringToTurkishQueryString(string queryStringKey) 
        {
            var currentUri = new Uri(HttpContext.Current.Request.Url.Scheme + "://" +
                HttpContext.Current.Request.Url.Authority +
                HttpContext.Current.Request.RawUrl);
            var queryStringCollection = HttpUtility.ParseQueryString((currentUri).Query);
            string returnValue = queryStringCollection.Get(queryStringKey);
            return !string.IsNullOrWhiteSpace(returnValue) ? queryStringCollection.Get(queryStringKey)
                .Replace('ð', 'ğ').Replace('Ð', 'Ğ')
                .Replace('ý', 'i').Replace('Ý', 'İ')
                .Replace('þ', 'ş').Replace('Þ', 'Ş') : "";//çÇðÐýİöÖþÞüÜ
        }

        public static string DataTableToYQLString(DataTable dt, string columnName)
        {
            List<string> items = new List<string>();
            foreach (DataRow row in dt.Rows)
                items.Add("\"" + row[columnName].ToString() + "\"");
            string query = "select * from yahoo.finance.xchange where pair in (" + string.Join(",", items) + ")&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
            return query;
        }
    }
}