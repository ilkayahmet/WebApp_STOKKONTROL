using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.datatype;

namespace WebApp.controls.database
{
    public class StockProc : Proc
    {
        /// <summary>
        /// Use this constructor with StockProcType.GetById || StockProcType.Delete
        /// </summary>
        /// <param name="type"></param>
        /// <param name="stockid"></param>
        public StockProc(StockProcType type, int stockid)
        {
            UnitType unitType = UnitType.adet;
            init(type, string.Empty, 0, 0, stockid, 0,0, unitType, string.Empty);
        }

        /// <summary>
        /// Use this constructor with StockProcType.GetAll
        /// </summary>
        /// <param name="type">Procedure process type</param>
        /// <param name="id">User ID who is performing this process</param>
        /// <param name="filterType">filter search type for get all</param>
        /// <param name="filter">searches in text fields and brings what contains this filter</param>
        /// <param name="pageIndex"></param>
        /// <param name="pageRowCount"></param>
        public StockProc(StockProcType type, string filter, int pageIndex, int pageRowCount)
        {
            UnitType unitType = UnitType.adet;
            init(type, filter, pageRowCount, pageIndex, 0, 0, 0, unitType,  string.Empty);
        }

        /// <summary>
        /// Use this constructor with StockProcType.Create
        /// </summary>
        /// <param name="type"></param>
        /// <param name="productid"></param>
        /// <param name="quantity"></param>
        /// <param name="unit"></param>
        /// <param name="comment"></param>
        public StockProc(StockProcType type, int productid, decimal quantity, UnitType unit, string comment)
        {
            
            init(type, string.Empty, 0, 0, 0, productid, quantity, unit, comment);
        }

        /// <summary>
        /// Use this constructor with StockProcType.Modify
        /// </summary>
        /// <param name="type"></param>
        /// <param name="stockid"></param>
        /// <param name="productid"></param>
        /// <param name="quantity"></param>
        /// <param name="unit"></param>
        /// <param name="comment"></param>
        public StockProc(StockProcType type, int stockid, int productid, decimal quantity, UnitType unit, string comment)
        {

            init(type, string.Empty, 0, 0, stockid, productid, quantity, unit, comment);
        }

        /// <summary>
        /// Use this constructor with StockProcType.Report
        /// </summary>
        /// <param name="type"></param>
        /// <param name="productid"></param>
        /// <param name="dummydata"></param>
        public StockProc(StockProcType type, int productid, string dummydata)
        {
            UnitType unitType = UnitType.adet;
            init(type, string.Empty, 0, 0, 0, productid, 0, unitType, string.Empty);
        }
        private void init(StockProcType type, string filter, int pageRowCount, int pageIndex, int stockid, int productid, decimal quantity, UnitType unit, string comment
            )
        {
            Name = "STOCK_PROC";
            Params = new Dictionary<string, object>
            {
                { "@TYPE", (int)type },
                { "@FILTER", filter },
                { "@PAGEROWCOUNT", pageRowCount },
                { "@PAGEINDEX", pageIndex },
                { "@STOCKID", stockid },
                { "@UUID", productid },
                { "@QUANTITY", quantity },
                { "@UNIT", (int)unit },
                { "@COMMENT", comment }
            };
        }
    }
}

