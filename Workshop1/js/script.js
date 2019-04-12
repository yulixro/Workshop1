
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
                    $("#book_grid").data("kendoGrid").dataSource.remove(dataItem);
                }
            }
        ],
        content: "確定要刪除" + dataItem.BookName + "嗎?",
    });

    dialog.data("kendoDialog").open();

}

//變換圖片
function onChange() {
    val = "image/" + $("#book_category").val() + ".jpg";
    $(".book-image").attr("src", val);
}

$(function () {

    loadBookData();

    //Grid
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            pageSize: 20
        },
        height: 550,
        sortable: true,
        toolbar: "<input type='text' class='k-textbox' id='book_search' placeholder='我想要找......'>",
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
            template: function (dataItem) {
                if (dataItem.BookDeliveredDate != undefined) {
                    return "<i class='fas fa-truck' title=" + dataItem.BookDeliveredDate + "></i>";
                } else {
                    return "";
                }
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

    //Tooltip
    $("#book_grid").kendoTooltip({
        filter: "i",
        position: "bottom",
        width: 120
    });

    //搜尋事件
    $("#book_search").keyup(function () {
        var value = $("#book_search").val();
        var grid = $("#book_grid").data("kendoGrid");
        if (value) {
            grid.dataSource.filter({
                logic: "or",
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

    //TextBox
    $("#book_name").kendoMaskedTextBox();
    $("#book_author").kendoMaskedTextBox();
    $("#book_price, #book_amount").kendoNumericTextBox({ format: "n0", decimals: 0 });

    //DropDownList
    $("#book_category").kendoDropDownList({
        dataSource: bookCategoryList,
        dataTextField: "text",
        dataValueField: "value",
        change: onChange
    });

    //DatePicker
    $("#bought_datepicker").kendoDatePicker({
        value: todayDate,
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy/MM/dd", "yyyyMMdd"],
        footer: "#: kendo.toString(data, 'yyyy') # 年 #: kendo.toString(data, 'MM') # 月 #: kendo.toString(data, 'dd') # 日"
    });
    $("#delivered_datepicker").kendoDatePicker({
        value: todayDate,
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy/MM/dd", "yyyyMMdd"],
        footer: "#: kendo.toString(data, 'yyyy') # 年 #: kendo.toString(data, 'MM') # 月 #: kendo.toString(data, 'dd') # 日"
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

    //驗證Input
    var validator = $("#book_form").kendoValidator({
        rules: {

            //輸入值是否為正確日期格式
            dateCorrect: function (input) {
                if (input.is("#bought_datepicker")) {
                    return input.data("kendoDatePicker").value();
                } else if (input.is("#delivered_datepicker")) {
                    return input.data("kendoDatePicker").value() || input.val() == "";
                } else {
                    return true;
                }
            },

            //購買日期不可晚於今天
            datePicker: function (input) {
                if (input.is("#bought_datepicker")) {
                    return input.data("kendoDatePicker").value() <= new Date(todayDate);
                } else {
                    return true;
                }
            },

            //送達日期不可早於購買日期
            datePicker2: function (input) {
                if (input.is("#delivered_datepicker")) {
                    return input.data("kendoDatePicker").value() >= $("#bought_datepicker").data("kendoDatePicker").value() || input.val() == "";
                } else {
                    return true;
                }
            }
        },
        messages: {
            dateCorrect: "請輸入正確日期",
            datePicker: "購買日期不可晚於今天",
            datePicker2: "送達日期不可早於購買日期"
        }
    }).data("kendoValidator");

    //儲存新增
    $("#save_book").kendoButton({
        click: function (e) {
            e.preventDefault();
            if (validator.validate()) {
                var categoryValue = $("#book_category").val();
                var nameValue = $("#book_name").val();
                var authorValue = $("#book_author").val();
                var boughtValue = $("#bought_datepicker").val();
                var deliveredValue = $("#delivered_datepicker").val();
                var priceValue = $("#book_price").val();
                var amountValue = $("#book_amount").val();
                var totalValue = parseInt(priceValue * amountValue);
                inputObject = {
                    BookId: (bookDataFromLocalStorage[(bookDataFromLocalStorage.length) - 1].BookId) + 1,
                    BookCategory: categoryValue,
                    BookName: nameValue,
                    BookAuthor: authorValue,
                    BookBoughtDate: boughtValue,
                    BookDeliveredDate: deliveredValue,
                    BookPrice: priceValue,
                    BookAmount: amountValue,
                    BookTotal: totalValue
                };
                bookDataFromLocalStorage.push(inputObject);
                stringJson = JSON.stringify(bookDataFromLocalStorage);
                localStorage.setItem('bookData', stringJson);
                $("#book_grid").data("kendoGrid").dataSource.read();
                $("#book_form").data("kendoWindow").close();
            }
        }
    });

    //改變金額,數量
    $("#book_amount, #book_price").change(function () {
        if ($(this).val() != "") {
            var amount = parseInt($("#book_amount").val());
            var price = parseInt($("#book_price").val());
            $("#book_total").text(amount * price);
            $("#book_total").text(parseInt($("#book_total").text()).toLocaleString());
        } else {
            $(this).data("kendoNumericTextBox").value($(this).attr("min"));
            $(this).trigger("change");
        }
    });
});