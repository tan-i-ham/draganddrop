var cart = (function($) {
    theme = $.jqx.theme;
    var productsOffset = 3,
        products = {
            '鴻海': {
                code: '2317',
                type: '股票',
                price: 110
            },
            '微星': {
                code: '2377',
                type: '股票',
                price: 76
            },
            '台積電': {
                code: '2330',
                type: '股票',
                price: 200
            },
            '國泰金': {
                code: '2882',
                type: '股票',
                price: 50
            },
            '統一超': {
                code: '2912',
                type: '股票',
                price: 270
            },
            'fund 1': {
                code: '8888',
                type: '債券',
                price: 8
            },

        },
        theme, onCart = false,
        cartItems = [],
        totalPrice = 0;
    total_stock = 0;
    total_debt = 0;


    function render() {
        productsRendering();
        gridRendering();
    };

    function addClasses() {
        $('.left').addClass('jqx-scrollbar-state-normal-' + theme);
        $('.draggable-demo-title').addClass('jqx-expander-header-' + theme);
        $('.draggable-demo-title').addClass('jqx-expander-header-expanded-' + theme);
        $('.draggable-demo-total').addClass('jqx-expander-header-' + theme).addClass('jqx-expander-header-expanded-' + theme);
        if (theme === 'shinyblack') {
            $('.draggable-demo-shop').css('background-color', '#555');
            $('.draggable-demo-product').css('background-color', '#999');
        }
    };

    function productsRendering() {
        var catalog = $('#catalog'),
            imageContainer = $('</div>'),
            image, product, left = 0,
            top = 0,
            counter = 0;
        for (var name in products) {
            product = products[name];
            image = createProduct(name, product);
            image.appendTo(catalog);
            if (counter !== 0 && counter % 1 === 0) {
                top += 80; // image.outerHeight() + productsOffset;
                left = 0;
            }
            image.css({
                left: left,
                top: top
            });
            left += 200; // image.outerWidth() + productsOffset;
            counter += 1;
        }
        $('.draggable-demo-product').jqxDragDrop({
            dropTarget: $('.target'),

            revert: true
        });

    };

    function createProduct(name, product) {
        return $('<div class="draggable-demo-product jqx-rc-all">' + '<div class="draggable-demo-product-code">' + product.code + '</div>' +
            '<div class="draggable-demo-product-type">' + product.type + '</div>' +
            '<div class="jqx-rc-t draggable-demo-product-header jqx-widget-header-' + theme + ' jqx-fill-state-normal-' + theme + '">' +
            '<div class="draggable-demo-product-header-label"> ' + name + '</div></div>' +
            '<div class="jqx-fill-state-normal-' + theme + ' draggable-demo-product-price">Price: <strong>$' + product.price + '</strong></div>' +

            '</div>');
    };
    // 右邊表格的結構欄位
    function gridRendering() {
        $("#jqxgrid").jqxGrid({
            height: 335,
            width: '100%',

            keyboardnavigation: false,
            selectionmode: 'none',
            columns: [{
                    text: '代碼',
                    dataField: 'code',
                    width: '20%',
                    cellsrenderer: linkrenderer,
                }, {
                    text: '標的',
                    dataField: 'name',
                    width: '20%',

                },
                {
                    text: '類型',
                    dataField: 'type',
                    width: '20%',

                }, {
                    text: '數量',
                    dataField: 'count',
                    width: '20%',

                }, {
                    text: '價格',
                    dataField: 'price',
                    width: '10%',

                }, {
                    text: '移除',
                    dataField: 'remove',
                    width: '10%',
                },

            ]
        });


        $("#jqxgrid").bind('cellclick', function(event) {
            var index = event.args.rowindex;
            if (event.args.datafield == 'remove') {
                var item = cartItems[index];
                if (item.count > 1) {
                    item.count -= 1;
                    updateGridRow(index, item);
                } else {
                    cartItems.splice(index, 1);
                    removeGridRow(index);
                }
                updatePrice_remove(item);

            }
        });

    };
    // value是股票代碼
    var linkrenderer = function(row, column, value) {

        if (value.indexOf('#') != -1) {
            value = value.substring(0, value.indexOf('#'));

        }
        // var format = { target: '"_blank"' };

        var link = ('#' + value);
        var html = $.jqx.dataFormat.formatlink(link, );
        console.log(typeof(html));
        var pos = html.lastIndexOf("#");
        var p1 = html.substring(0, pos);
        var p2 = html.substring(pos + 1, html.length);
        // console.log(pos, html);
        console.log(p1, ':', p2);
        // alert(value);
        // var html2 = html.spilt("#");
        // console.log(html2);
        return p1 + p2;
    }


    function init() {
        theme = getDemoTheme();
        render();
        addClasses();
        addEventListeners();
    };

    function addItem(item) {
        var index = getItemIndex(item.name);
        if (index >= 0) {
            cartItems[index].count += 1;
            updateGridRow(index, cartItems[index]);
        } else {
            var id = cartItems.length,
                item = {
                    code: item.code,
                    name: item.name,
                    type: item.type,
                    count: 1,
                    price: item.price,
                    index: id,
                    remove: '<div style="text-align: center; cursor: pointer;"' +
                        'id="draggable-demo-row-' + id + '">X</div>'
                };
            cartItems.push(item);
            addGridRow(item);
        }
        // updatePrice2(item.price);
        updatePrice(item);

    };



    function updatePrice(item) {
        totalPrice += item.price;
        $('#total').html('$ ' + totalPrice);
        // console.log(item);
        if (item.type == '股票') {
            total_stock += item.price;
            $('#total_stock').html('$ ' + total_stock);
        } else {
            total_debt += item.price;
            $('#total_debt').html('$ ' + total_debt);
        }
        var f = (total_stock / totalPrice);
        var sr = (parseFloat(f) * 100).toFixed(2);

        $('#stock_ratio').html(sr + ' %');
        $('#debt_ratio').html((100 - sr).toFixed(2) + ' %');
    };

    function updatePrice_remove(item) {
        totalPrice -= item.price;
        $('#total').html('$ ' + totalPrice);
        if (item.type == '股票') {
            total_stock -= item.price;
            $('#total_stock').html('$ ' + total_stock);
        } else {
            total_debt -= item.price;
            $('#total_debt').html('$ ' + total_debt);

        }
        var f = (total_stock / totalPrice);
        var sr = (parseFloat(f) * 100).toFixed(2);

        $('#stock_ratio').html(sr + ' %');
        $('#debt_ratio').html((100 - sr).toFixed(2) + ' %');

    }



    function addGridRow(row) {
        $("#jqxgrid").jqxGrid('addrow', null, row);
    };

    function updateGridRow(id, row) {
        var rowID = $("#jqxgrid").jqxGrid('getrowid', id);
        $("#jqxgrid").jqxGrid('updaterow', rowID, row);
    };

    function removeGridRow(id) {
        var rowID = $("#jqxgrid").jqxGrid('getrowid', id);
        $("#jqxgrid").jqxGrid('deleterow', rowID);
    };

    function getItemIndex(name) {
        for (var i = 0; i < cartItems.length; i += 1) {
            if (cartItems[i].name === name) {
                return i;
            }
        }
        return -1;
    };

    function toArray(obj) {
        var item, array = [],
            counter = 1;
        for (var key in obj) {
            item = {};
            item = {
                name: key,
                price: obj[key].count,
                count: obj[key].price,
                type: obj[key].type,
                code: obj[key].code,
                number: counter
            }
            array.push(item);
            counter += 1;
        }
        return array;
    };



    function addEventListeners() {
        // drag drop related
        $('.draggable-demo-product').bind('dropTargetEnter', function(event) {
            $(event.args.target).css('border', '5px solid #000');
            onCart = true;
            $(this).jqxDragDrop('dropAction', 'none');
        });
        $('.draggable-demo-product').bind('dropTargetLeave', function(event) {
            $(event.args.target).css('border', '1px solid #aaa');
            onCart = false;
            $(this).jqxDragDrop('dropAction', 'default');
        });
        $('.draggable-demo-product').bind('dragEnd', function(event) {
            $('#stock').css('border', '2px dashed #aaa');
            if (onCart) {
                addItem({
                    price: event.args.price,
                    name: event.args.name,
                    code: event.args.code,
                    type: event.args.type,
                });
                onCart = false;
            }
        });
        $('.draggable-demo-product').bind('dragStart', function(event) {
            var tshirt = $(this).find('.draggable-demo-product-header').text(),
                price = $(this).find('.draggable-demo-product-price').text().replace('Price: $', ''),
                code = $(this).find('.draggable-demo-product-code').text(),
                type = $(this).find('.draggable-demo-product-type').text();
            $('#stock').css('border', '2px solid #aaa');
            price = parseInt(price, 10);
            $(this).jqxDragDrop('data', {
                price: price,
                name: tshirt,
                code: code,
                type: type,
            });
        });
    };

    return {
        init: init
    }
}($));




// $(document).ready(function() {

// });
function slider() {
    function displayEvent(event) {
        var eventData = event.type;
        eventData += ': ' + event.args.value;
        $('#events').jqxPanel('clearContent');
        $('#events').jqxPanel('prepend', '<div class="item" style="margin-top: 5px;">' + eventData + '</div>');


    }
    $('#events').jqxPanel({
        height: '250px',
        width: '450px'
    });
    $('#jqxSlider div').css('margin', '5px');
    //change event
    $('#jqxSlider').jqxSlider({
        template: "success",
        tooltip: true,
        mode: 'fixed',
        width: '100%',
        height: 60,
        min: 0,
        max: 100,
        value: 10,
        ticksFrequency: 10,
        showMinorTicks: true,
        minorTicksFrequency: 1,
        showTickLabels: true
    });


    $('#jqxSlider').on('change', function(event) {
        displayEvent(event);
        console.log(event);
    });
}
$(document).ready(function() {

    slider();
    cart.init();
    // $('#jqxSlider').arg.value = (total_stock / totalPrice).toFixed(2);
    console.log($('#jqxSlider'));

});