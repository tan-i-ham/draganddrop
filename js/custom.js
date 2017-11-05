function gridRendering() {
    $("#jqxgrid2").jqxGrid({
        height: 335,
        width: '100%',

        keyboardnavigation: false,
        selectionmode: 'none',
        columns: [{
            text: 'Item',
            dataField: 'name',
            width: '50%',
        }, {
            text: 'Count',
            dataField: 'count',
            width: 50
        }, {
            text: 'Price',
            dataField: 'price',
            width: 60
        }, {
            text: 'Remove',
            dataField: 'remove',
            width: 60
        }, ]
    });
    $("#jqxgrid2").bind('cellclick', function(event) {
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
            updatePrice(-item.price);
        }
    });
};