using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using WebApp.controls;
using WebApp.controls.database;
using WebApp.datatype;

namespace WebApp.models
{
    public class Stock
    {
        public HttpContext Context { get; private set; }
        public Stock(HttpContext context)
        {
            this.Context = context;
        }
        public string GetById()
        {
            string result;
            int stockid;
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            if (!Valid.StockGetById(data, out result, out stockid))
                return result;
            DataTable dt = Database.FillTable(new StockProc(StockProcType.GetById, stockid));
            return Converter.DataTableToJSON(dt);
        }
        public string GetAll()
        {
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            string result, filter;
            int pageIndex, pageRowCount;
            if (!Valid.StockGetAll(data, out result, out filter, out pageIndex, out pageRowCount))
                return result;

            DataSet ds = Database.FillSet(new StockProc(StockProcType.GetAll, filter, pageIndex, pageRowCount));
            if (ds.Tables.Count == 2)
            {
                result = "{\"RESULT\":1,\"TOTALROW\":" + ds.Tables[0].Rows[0]["TOTALROW"].ToString() + ",\"PAGEINDEX\":" + ds.Tables[0].Rows[0]["PAGEINDEX"].ToString() + ",";
                ds.Tables[1].TableName = "LIST";
                result += Converter.DataTableToJSONArray(ds.Tables[1]) + "}";
                return result;
            }
            if (ds.Tables.Count == 1 && ds.Tables[0].Rows.Count == 1 && ds.Tables[0].Columns.Contains("RESULT"))
                return "{\"RESULT\":" + ds.Tables[0].Rows[0]["RESULT"].ToString() + "}";
            return "{\"RESULT\":-1}";
        }

        public string Create()
        {
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            string result, comment;
            int productid;
            decimal quantity;
            UnitType unit;
            if (!Valid.StockCreate(data, out result, out productid, out quantity, out unit, out comment))
                return result;
            DataTable dt = Database.FillTable(new StockProc(StockProcType.Create, productid, quantity, unit, comment));
            if (dt == null || dt.Rows.Count != 1 || dt.Columns[0].ColumnName != "RESULT")
                throw new ArgumentNullException();

            return Converter.DataRowToJSON(dt.Rows[0]);
        }

        public string Modify()
        {
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            string result, comment;
            int productid, stockid;
            decimal quantity;
            UnitType unit;
            if (!Valid.StockModify(data, out result, out stockid, out productid, out quantity, out unit, out comment))
                return result;
            DataTable dt = Database.FillTable(new StockProc(StockProcType.Modify, stockid, productid, quantity, unit, comment));
            if (dt == null || dt.Rows.Count != 1 || dt.Columns[0].ColumnName != "RESULT")
                throw new ArgumentNullException();

            return Converter.DataRowToJSON(dt.Rows[0]);
        }
        public string Delete()
        {
            string result;
            int stockid;
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            if (!Valid.StockDelete(data, out result, out stockid))
                return result;
            DataTable dt = Database.FillTable(new StockProc(StockProcType.Delete, stockid));
            return Converter.DataTableToJSON(dt);
        }
        public string Report()
        {
            string result, dummydata;
            int productid;
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            if (!Valid.StockReport(data, out result, out productid, out dummydata))
                throw new HttpRequestValidationException();
            DataTable dt = Database.FillTable(new StockProc(StockProcType.Report, productid, dummydata));
            return Converter.DataTableToJSON(dt);
        }
    }
}