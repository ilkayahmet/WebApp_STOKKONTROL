<%@ Page Title="" Language="C#" MasterPageFile="~/Stoktakip.Master" AutoEventWireup="true" CodeBehind="stock.aspx.cs" Inherits="WebApp.stock" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="assets/js/stock.js"></script>
    <!-- Angular Components -->
    <script type="text/javascript" src="assets/js/component/breadcrumb.js"></script>
    <script type="text/javascript" src="assets/js/component/page-header.js"></script>
    <script type="text/javascript" src="assets/js/component/page-footer.js"></script>
    <script type="text/javascript" src="assets/js/component/product-dropdown.js"></script>
    <script type="text/javascript" src="assets/js/component/stock-create-btn.js"></script>
    <script type="text/javascript" src="assets/js/component/stock-create-modal.js"></script>
    <script type="text/javascript" src="assets/js/component/stock-modify-modal.js"></script>
    <script type="text/javascript" src="assets/js/component/stock-report-btn.js"></script>
    <script type="text/javascript" src="assets/js/component/stock-report-modal.js"></script>
    <script type="text/javascript" src="assets/js/component/stock-delete-modal.js"></script>
    <script type="text/javascript" src="assets/js/component/stock-list.js"></script>
    <!-- /angular Components -->
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <page-header></page-header>
    <div class="content">
        <stock-create-btn></stock-create-btn>
        <stock-report-btn ng-controller="stockReportBtnCtrl"></stock-report-btn>
        <stock-list></stock-list>
        <page-footer></page-footer>
        <stock-create-modal></stock-create-modal>
        <stock-modify-modal></stock-modify-modal>
        <stock-delete-modal></stock-delete-modal>
        <stock-report-modal ng-controller="stockReportModalCtrl"></stock-report-modal>
    </div>
</asp:Content>
