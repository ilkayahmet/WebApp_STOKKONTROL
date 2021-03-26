using System;
using System.Collections.Generic;
using System.Data;
using System.Web;
using WebApp.controls;
using WebApp.controls.database;
using WebApp.datatype;

namespace WebApp.models
{
    public class Product
    {
        public HttpContext Context { get; private set; }

        #region Constructors
        public Product(HttpContext context)
        {
            this.Context = context;
        }
        #endregion Constructors

        #region Methods
        
        public Product Get(int id)
        {
            return this;
        }
        public string GetById()
        {
            string result;
            int productid;
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            if (!Valid.ProductGetById(data, out result, out productid))
                return result;
            DataTable dt = Database.FillTable(new ProductProc(ProductProcType.GetById, productid));
            return Converter.DataTableToJSON(dt);
        }
        public string GetAll()
        {
            string result, filter;
            int pageIndex, pageRowCount;
            FilterType filterType;
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            if (!Valid.ProductGetAll(data, out result, out filterType, out filter, out pageIndex, out pageRowCount))
                return result;
            DataSet ds = Database.FillSet(new ProductProc(ProductProcType.GetAll, filterType, filter, pageIndex, pageRowCount));
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
            string result, name, comment;
            if (!Valid.ProductCreate(data, out result, out name, out comment))
                return result;
            DataTable dt = Database.FillTable(new ProductProc(ProductProcType.Create, name, comment));
            if (dt == null || dt.Rows.Count != 1 || dt.Columns[0].ColumnName != "RESULT")
                throw new ArgumentNullException();
            return Converter.DataRowToJSON(dt.Rows[0]);
        }
        public string Modify()
        {
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            string result, name, comment;
            int productid;
            if (!Valid.ProductModify(data, out result, out productid, out name, out comment))
                return result;
            DataTable dt = Database.FillTable(new ProductProc(ProductProcType.Modify,  productid, name, comment));
            if (dt == null || dt.Rows.Count != 1 || dt.Columns[0].ColumnName != "RESULT")
                throw new ArgumentNullException();
            return Converter.DataRowToJSON(dt.Rows[0]);
        }
        public string Delete()
        {
            Dictionary<string, object> data = Converter.JSONToDictionary(Context.Request.InputStream);
            string result;
            int productid;
            if (!Valid.ProductDelete(data, out result, out productid))
                return result;
            DataTable dt = Database.FillTable(new ProductProc(ProductProcType.Delete, productid));
            if (dt == null || dt.Rows.Count != 1 || dt.Columns[0].ColumnName != "RESULT")
                throw new ArgumentNullException();
            return Converter.DataRowToJSON(dt.Rows[0]);
        }
        #endregion Methods
    }
}