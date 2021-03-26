using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.controls;
using WebApp.datatype;
using WebApp.models;

namespace WebApp.hub
{
    /// <summary>
    /// Summary description for stock
    /// </summary>
    public class stock : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            int type = -1;
            int.TryParse(Converter.QueryStringToTurkishQueryString("t"), out type);
            string result;
            Stock stock = new Stock(context);
            switch (type)
            {
                case (int)StockProcType.GetById:
                    result = stock.GetById();
                    break;
                case (int)StockProcType.GetAll:
                    result = stock.GetAll();
                    break;
                case (int)StockProcType.Create:
                    result = stock.Create();
                    break;
                case (int)StockProcType.Modify:
                    result = stock.Modify();
                    break;
                case (int)StockProcType.Delete:
                    result = stock.Delete();
                    break;
                case (int)StockProcType.Report:
                    result = stock.Report();
                    break;
                default: throw new ArgumentException();
            }
            context.Response.Clear();
            context.Response.ContentType = "application/json; charset=utf-8";
            context.Response.Write(result);
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}