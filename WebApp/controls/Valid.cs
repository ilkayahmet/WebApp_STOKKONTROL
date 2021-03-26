using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using WebApp.controls.database;
using WebApp.datatype;
using WebApp.models;

namespace WebApp.controls
{
    public static class Valid
    {
        #region public methods
        #region generic methods
        public static bool ID(int input)
        {
            bool includeZero = false;
            return positiveNumber(input, includeZero);
        }

        public static bool Name(string input)
        {
            return !string.IsNullOrWhiteSpace(input);
        }

        public static bool Comment(string input)
        {
            return input != null;
        }

        public static bool FilterType(int input, out FilterType result)
        {
            switch (input)
            {
                case (int)datatype.FilterType.Dropdown:
                    result = datatype.FilterType.Dropdown;
                    return true;
                case (int)datatype.FilterType.List:
                    result = datatype.FilterType.List;
                    return true;
                default:
                    result = datatype.FilterType.List;
                    return false;
            }
        }
        #endregion generic methods

       
        #region product methods
        public static bool ProductCreate(Dictionary<string, object> data,
            out string result,
            out string name,
            out string comment)
        {
            result = string.Empty;
            name = data["name"].ToString();
            comment = data["comment"].ToString();

            if (!Valid.Name(name))
            {
                result = "{\"RESULT\":8}";
                return false;
            }
            return true;
        }
        public static bool ProductModify(Dictionary<string, object> data,
            out string result,
            out int productid,
            out string name,
            out string comment)
        {
            result = string.Empty;
            productid = Convert.ToInt32(data["productid"]);
            name = data["name"].ToString();
            comment = data["comment"].ToString();
            if (!Valid.ID(productid))
            {
                result = "{\"RESULT\":6}";
                return false;
            }
            if (!Valid.Name(name))
            {
                result = "{\"RESULT\":8}";
                return false;
            }
            return true;
        }
        public static bool ProductGetById(Dictionary<string, object> data,
            out string result,
            out int productid)
        {
            result = string.Empty;
            productid = Convert.ToInt32(data["productid"]);
            if (!Valid.ID(productid))
            {
                result = "{\"RESULT\":6}";
                return false;
            }
            return true;
        }
        public static bool ProductDelete(Dictionary<string, object> data,
            out string result,
            out int productid)
        {
            result = string.Empty;
            productid = Convert.ToInt32(data["productid"]);
            if (!Valid.ID(productid))
            {
                result = "{\"RESULT\":6}";
                return false;
            }
            return true;
        }
        public static bool ProductGetAll(Dictionary<string, object> data,
           out string result,
           out FilterType filterType,
           out string filter,
           out int pageIndex,
           out int pageRowCount)
        {
            filterType = datatype.FilterType.List;
            if (!getAll(data, out result, out filter, out pageIndex, out pageRowCount))
                return false;
            if (!Valid.FilterType(Convert.ToInt16(data["filterType"]), out filterType))
            {
                result = "{\"RESULT\":-1}";
                return false;
            }
            return true;

        }
        #endregion product methods
        #region stock methods
        public static bool UnitTypeVal(int type, out UnitType result)
        {
            switch (type)
            {
                case (int)UnitType.adet:
                    result = UnitType.adet;
                    return true;
                case (int)UnitType.kg:
                    result = UnitType.kg;
                    return true;
                case (int)UnitType.lt:
                    result = UnitType.lt;
                    return true;
                default:
                    result = UnitType.adet;
                    return false;
            }
        }
        public static bool Quantity(decimal input)
        {
            return positiveNumber(input, true);
        }
        public static bool StockGetAll(Dictionary<string, object> data,
            out string result,
            out string filter,
            out int pageIndex,
            out int pageRowCount)
        {
            if (!getAll(data, out result, out filter, out pageIndex, out pageRowCount))
                return false;
            return true;
        }
        public static bool StockGetById(Dictionary<string, object> data,
            out string result,
            out int stockid)
        {
            result = string.Empty;
            stockid = Convert.ToInt32(data["stockid"]);
            if (!Valid.ID(stockid))
            {
                result = "{\"RESULT\":9}";
                return false;
            }
            return true;
        }
        public static bool StockDelete(Dictionary<string, object> data,
            out string result,
            out int stockid)
        {
            result = string.Empty;
            stockid = Convert.ToInt32(data["stockid"]);
            if (!Valid.ID(stockid))
            {
                result = "{\"RESULT\":9}";
                return false;
            }
            return true;
        }
        public static bool StockReport(Dictionary<string, object> data,
            out string result,
            out int productid,
            out string dummydata)
        {
            result = string.Empty;
            productid = Convert.ToInt32(data["productid"]);
            dummydata = string.Empty;
            if (!Valid.ID(productid))
            {
                result = "{\"RESULT\":6}";
                return false;
            }
            return true;
        }
        public static bool StockCreate( Dictionary<string, object> data,
            out string result,
            out int productid,
            out decimal quantity,
            out UnitType unit,
            out string comment)
        {
            result = string.Empty;
            productid = Convert.ToInt32(data["productid"]);
            quantity = Convert.ToDecimal(data["quantity"]);
            unit = UnitType.adet;
            comment = data["comment"].ToString();
            if (!Valid.ID(productid))
            {
                result = "{\"RESULT\":6}";
                return false;
            }
            if (!Valid.Quantity(quantity))
            {
                result = "{\"RESULT\":10}";
                return false;
            }
            if (!Valid.UnitTypeVal(Convert.ToInt16(data["unit"]), out unit))
            {
                result = "{\"RESULT\":11}";
                return false;
            }
            return true;
        }

        public static bool StockModify(Dictionary<string, object> data,
            out string result,
            out int stockid,
            out int productid,
            out decimal quantity,
            out UnitType unit,
            out string comment)
        {
            result = string.Empty;
            stockid = Convert.ToInt32(data["id"]);
            productid = Convert.ToInt32(data["productid"]);
            quantity = Convert.ToDecimal(data["quantity"]);
            unit = UnitType.adet;
            comment = data["comment"].ToString();
            if (!Valid.ID(stockid))
            {
                result = "{\"RESULT\":9}";
                return false;
            }
            if (!Valid.ID(productid))
            {
                result = "{\"RESULT\":6}";
                return false;
            }
            if (!Valid.Quantity(quantity))
            {
                result = "{\"RESULT\":10}";
                return false;
            }
            if (!Valid.UnitTypeVal(Convert.ToInt16(data["unit"]), out unit))
            {
                result = "{\"RESULT\":11}";
                return false;
            }
            return true;
        }
        #endregion stock methods
       
        #endregion public methods
        #region private methods
        private static bool regexCheck(string pattern, string input)
        {
            return new Regex(pattern).IsMatch(input);
        }

        private static bool positiveNumber(int input, bool includeZero = true)
        {
            return includeZero ? input >= 0 : input > 0;
        }
        private static bool positiveNumber(decimal input, bool includeZero = true)
        {
            return includeZero ? input >= decimal.Zero : input > decimal.Zero;
        }

        private static bool getAll(Dictionary<string, object> data,
            out string result,
            out string filter,
            out int pageIndex,
            out int pageRowCount)
        {
            result = string.Empty;
            filter = data["filter"].ToString();
            pageIndex = Convert.ToInt16(data["pageIndex"]);
            pageRowCount = Convert.ToInt16(data["pageRowCount"]);
            if (filter == null || pageIndex <= 0 || pageRowCount <= 0)
            {
                result = "{\"RESULT\":-1}";
                return false;
            }
            return true;
        }
        
        #endregion private methods
    }
}