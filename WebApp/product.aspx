<%@ Page Title="" Language="C#" MasterPageFile="~/Stoktakip.Master" AutoEventWireup="true" CodeBehind="product.aspx.cs" Inherits="WebApp.product" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script type="text/javascript" src="assets/js/product.js"></script>
    <!-- Angular Components -->
    <script type="text/javascript" src="assets/js/component/breadcrumb.js"></script>
    <script type="text/javascript" src="assets/js/component/page-header.js"></script>
    <script type="text/javascript" src="assets/js/component/page-footer.js"></script>
    <script type="text/javascript" src="assets/js/component/product-list.js"></script>
    <script type="text/javascript" src="assets/js/component/product-create-modal.js"></script>
    <script type="text/javascript" src="assets/js/component/product-create-btn.js"></script>
    <script type="text/javascript" src="assets/js/component/product-modify-modal.js"></script>
    <script type="text/javascript" src="assets/js/component/product-delete-modal.js"></script>
    <!-- /angular Components -->
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
     <page-header></page-header>
    <!-- Content -->
    <div class="content">
        <product-create-btn ng-controller="productCreateBtnCtrl"></product-create-btn>
        <product-list ng-controller="productListCtrl"></product-list>
		<page-footer></page-footer>
        <product-create-modal ng-controller="productCreateModalCtrl"></product-create-modal>
        <product-modify-modal ng-controller="productModifyModalCtrl"></product-modify-modal>
        <product-delete-modal ng-controller="productDeleteModalCtrl"></product-delete-modal>
	</div>
    <!-- /content -->
</asp:Content>