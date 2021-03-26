using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.datatype;

namespace WebApp.controls.database
{
    public class ProductProc : Proc
    {
        /// <summary>
        /// Use this constructor with ProductProcType.GetById || ProductProcType.Delete
        /// </summary>
        /// <param name="type"></param>
        /// <param name="productid"></param>
        public ProductProc(ProductProcType type, int productid)
        {
            FilterType filterType = FilterType.Dropdown;
            init(type,filterType, string.Empty, 0, 0, productid, string.Empty, string.Empty);
        }

        /// <summary>
        /// Use this constructor with ProductProcType.GetAll
        /// </summary>
        /// <param name="type">Procedure process type</param>
        /// <param name="filter"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageRowCount"></param>
        public ProductProc(ProductProcType type, FilterType filterType, string filter, int pageIndex, int pageRowCount)
        {
            init(type, filterType, filter, pageRowCount, pageIndex, 0, string.Empty, string.Empty);
        }

        /// <summary>
        /// Use this constructor with ProductProcType.Create
        /// </summary>
        /// <param name="type"></param>
        /// <param name="name"></param>
        /// <param name="comment"></param>
        public ProductProc(ProductProcType type, string name, string comment)
        {
            FilterType filterType = FilterType.Dropdown;
            init(type,filterType, string.Empty, 0, 0, 0, name, comment);
        }

        /// <summary>
        /// Use this constructor with ProductProcType.Modify
        /// </summary>
        /// <param name="type"></param>
        /// <param name="productid"></param>
        /// <param name="name"></param>
        /// <param name="comment"></param>
        public ProductProc(ProductProcType type, int productid, string name, string comment)
        {
            FilterType filterType = FilterType.Dropdown;
            init(type,filterType, string.Empty, 0, 0, productid, name, comment);
        }

        private void init(ProductProcType type, FilterType filterType, string filter, int pagerowcount, int pageindex, int productid, string name, string comment)
        {
            Name = "PRODUCT_PROC";
            Params = new Dictionary<string, object>
            {
                { "@TYPE", (int)type },
                { "@FILTERTYPE", (int)filterType },
                { "@FILTER", filter },
                { "@PAGEROWCOUNT", pagerowcount },
                { "@PAGEINDEX", pageindex },
                { "@UUID", productid },
                { "@NAME", name },
                { "@COMMENT", comment }
            };
        }
    }
}

