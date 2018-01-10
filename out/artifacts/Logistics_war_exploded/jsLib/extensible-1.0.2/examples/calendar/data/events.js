/*!
 * Extensible 1.0.2
 * Copyright(c) 2010-2012 Extensible, LLC
 * licensing@ext.ensible.com
 * http://ext.ensible.com
 */
var today = new Date().clearTime();
Ext.ensible.sample.EventData = {
    "evts":[{
        "id":1001,
        "cid":1,
        "title":"霞浦",
        "start":today.add(Date.DAY, -20).add(Date.HOUR, 10),
        "end":today.add(Date.DAY, -10).add(Date.HOUR, 15),
		"notes":"Have fun"
    },{
        "id":1002,
        "cid":2,
        "title":"福建-霞浦",
        "start":today.add(Date.HOUR, 11).add(Date.MINUTE, 30),
        "end":today.add(Date.HOUR, 13),
        "loc":"Chuy's!",
        "url":"http://chuys.com",
		"notes":"Order the queso",
        "rem":"15"
    },{
        "id":1003,
        "cid":3,
        "title":"福建-霞浦",
        "start":today.add(Date.HOUR, 15),
        "end":today.add(Date.HOUR, 15)
    },{
        "id":1004,
        "cid":1,
        "title":"宁德",
        "start":today,
        "end":today,
        "notes":"Need to get a gift",
        "ad":true
    },{
        "id":1005,
        "cid":2,
        "title":"诏安-广州1000吨",
        "start":today.add(Date.DAY, -12),
        "end":today.add(Date.DAY, 10).add(Date.SECOND, -1),
        "ad":true
    },{
        "id":1006,
        "cid":3,
        "title":"霞浦",
        "start":today.add(Date.DAY, 5),
        "end":today.add(Date.DAY, 7).add(Date.SECOND, -1),
        "ad":true,
        "rem":"2880"
    },{
        "id":1007,
        "cid":1,
        "title":"福州",
        "start":today.add(Date.HOUR, 9),
        "end":today.add(Date.HOUR, 9).add(Date.MINUTE, 30),
		"notes":"Get cash on the way"
    },{
        "id":1008,
        "cid":3,
        "title":"霞浦11",
        "start":today.add(Date.DAY, -30),
        "end":today.add(Date.DAY, -28),
        "ad":true
    },{
        "id":1009,
        "cid":2,
        "title":"霞浦22",
        "start":today.add(Date.DAY, -2).add(Date.HOUR, 13),
        "end":today.add(Date.DAY, -2).add(Date.HOUR, 18),
        "loc":"ABC Inc.",
        "rem":"60"
    },{
        "id":1010,
        "cid":3,
        "title":"南平-霞浦 2500吨",
        "start":today.add(Date.DAY, -2),
        "end":today.add(Date.DAY, 3).add(Date.SECOND, -1),
        "ad":true
    },{
        "id":1011,
        "cid":1,
        "title":"长乐-北京  500吨",
        "start":today.add(Date.DAY, 2).add(Date.HOUR, 19),
        "end":today.add(Date.DAY, 2).add(Date.HOUR, 23),
        "notes":"Don't forget the tickets!",
        "rem":"60"
    },{
        "id":1012,
        "cid":4,
        "title":"漳州-汕头 400吨",
        "start":today.add(Date.DAY, 8).add(Date.HOUR, 8),
        "end":today.add(Date.DAY, 10).add(Date.HOUR, 17)
    },{
        "id":1013,
        "cid":4,
        "title":"永泰-宁德 300吨",
        "start":today.add(Date.DAY, 5).add(Date.HOUR, 10),
        "end":today.add(Date.DAY, 5).add(Date.HOUR, 12)
    }]
};
