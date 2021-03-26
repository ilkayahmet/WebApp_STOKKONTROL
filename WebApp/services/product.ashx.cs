using System;
using System.Net;
using System.Web;
using WebApp.controls;
using WebApp.datatype;
using WebApp.models;

namespace WebApp.hub
{
    /// <summary>
    /// Summary description for product
    /// </summary>
    public class product : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            int type = -1;
            int.TryParse(Converter.QueryStringToTurkishQueryString("t"), out type);
            string result;
            Product product = new Product(context);
            switch (type)
            {
                
                case (int)ProductProcType.GetById:
                    result = product.GetById();
                    break;
                case (int)ProductProcType.GetAll:
                    result = product.GetAll();
                    break;
                case (int)ProductProcType.Create:
                    result = product.Create();
                    break;
                case (int)ProductProcType.Modify:
                    result = product.Modify();
                    break;
                case (int)ProductProcType.Delete:
                    result = product.Delete();
                    break;
                default:
                    result = string.Empty;
                    break;
            }
            response(context, result);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        private void response(HttpContext context, string result)
        {
            context.Response.Clear();
            context.Response.ContentType = "application/json; charset=utf-8";
            context.Response.Write(result);
            context.Response.End();
        }
    }
}