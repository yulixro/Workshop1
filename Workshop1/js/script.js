
var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}


//建立確認刪除dialog
function deleteConfirm(e) {

    e.preventDefault();
    var dialog = $("#delete_dialog");
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    var data = this.dataItem("tr");
    dialog.kendoDialog({
        width: "450px",
        closable: false,
        modal: false,
        actions: [
            { text: '取消' },
            {
                text: '確定',
                primary: true,
                action: function (e) {
                    $("#book_grid").data("kendoGrid").dataSource.remove(data);
                }
            }
        ],
        content: "確定要刪除" + dataItem.BookName + "嗎?",
    });

    dialog.data("kendoDialog").open();

}

$(function () {
    loadBookData();
    //套用Grid
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            pageSize: 20
        },
        height: 550,
        sortable: true,
        toolbar: "<input type='text' id='book_search' placeholder='我想要找......'>",
        pageable: {
            numeric: false,
            input: true,
            messages: {
                display: "顯示條目 {0}-{1} 共 {2} ",
                page: "頁",
                of: "共 {0}"
            }
        },
        columns: [{
            command: {
                text: "刪除",
                click: deleteConfirm
            },
            title: "&nbsp;",
            width: 150
        }, {
            field: "BookId",
            title: "書籍編號",
            width: 100
        }, {
            field: "BookName",
            title: "書籍名稱"
        }, {
            field: "BookCategory",
            title: "書籍種類",
            values: bookCategoryList,
        }, {
            field: "BookAuthor",
            title: "作者"
        }, {
            field: "BookBoughtDate",
            title: "購買日期",
            template: "#= kendo.toString(BookBoughtDate, 'yyyy-MM-dd') #"
        }, {
            field: "BookDeliveredDate",
            title: "送達狀態",
            template: function (e) {

            }
        }, {
            field: "BookPrice",
            title: "金額",
            attributes: { "align": "right" },
            template: "#= kendo.toString(BookPrice, 'n0') #"
        }, {
            field: "BookAmount",
            title: "數量",
            attributes: { "align": "right" }
        }, {
            field: "BookTotal",
            title: "總計",
            attributes: { "align": "right" },
            template: "#= kendo.toString(BookTotal, 'n0') # 元"
        }]

    });
    //設定搜尋欄css
    $("#book_search").css({
        "background-color": "#484891",
        "border-width": 0,
        "width": "30rem"
    });
    //搜尋事件
    $("#book_search").keyup(function () {
        var value = $("#book_search").val();
        grid = $("#book_grid").data("kendoGrid");
        if (value) {
            grid.dataSource.filter({
                filters: [
                    {
                        field: "BookName",
                        operator: "contains",
                        value: value
                    }, {
                        field: "BookAuthor",
                        operator: "contains",
                        value: value
                    }]
            });
        } else {
            grid.dataSource.filter({});
        }
    });

    //設定今天日期
    var todayDate = kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd');
    //套用Inputs
    $("#book_search").kendoMaskedTextBox();
    $("#book_name").kendoMaskedTextBox();
    $("#book_author").kendoMaskedTextBox();
    $("#book_price").kendoNumericTextBox();
    $("#book_amount").kendoNumericTextBox();
    //套用DropDownList
    $("#book_category").kendoDropDownList({
        optionLabel: "--請選擇類別--",
        dataSource: bookCategoryList,
        dataTextField: "text",
        dataValueField: "value"
    });
    //套用DatePicker
    $("#bought_datepicker").kendoDatePicker({
        value: todayDate,
        format: "yyyy-MM-dd"
    });
    $("#delivered_datepicker").kendoDatePicker({
        value: todayDate,
        format: "yyyy-MM-dd"
    });
    //建立新增書籍window
    var window = $("#book_form").kendoWindow({
        width: "615px",
        title: "新增書籍",
        actions: ["Minimize", "Maximize", "Close"],
        draggable: false,
        scrollable: true,
        modal: true
    });
    //點擊新增書籍button事件
    $("#add_book").kendoButton({
        click: function (e) {
            e.preventDefault();
            window.data("kendoWindow").center().open();
        }
    });
    //篩選Input條件
    var validator = $("#book_form").kendoValidator().data("kendoValidator"),
        status = $(".status");
    //12456
    $("form").submit(function (e) {
        e.preventDefault();
        if (validator.validate()) {
            status.text("Hooray! Your tickets has been booked!")
                .removeClass("invalid")
                .addClass("valid");
        } else {
            status.text("Oops! There is invalid data in the form.")
                .removeClass("valid")
                .addClass("invalid");
        }
    });
    //儲存新增
    $("#save_book").kendoButton({
        click: function (e) {

        }
    });


});