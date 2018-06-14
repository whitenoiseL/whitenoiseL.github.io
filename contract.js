"use strict";


var Contract = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.create = obj.create;
        this.agree = obj.agree;
        this.createtime = obj.createtime;
        this.agreetime = obj.agreetime;
        this.content = obj.content;
        this.status = obj.status;
        this.isagree = obj.isagree;
    } else {
        this.key = "";
        this.create = "";
        this.agree = "";
        this.createtime = "";
        this.agreetime = "";
        this.content = "";
        this.status = "";
        this.isagree = "";
    }
};


Contract.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Contracts = function () {
    LocalContractStorage.defineProperty(this, "size", null);
    LocalContractStorage.defineMapProperty(this, "sky", {
        parse: function (text) {
            return new Contract(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Contracts.prototype = {
    init: function () {
        // todo
        this.size = 1;
    },


    set: function (x, y) {
        var index = this.size;
        var from = Blockchain.transaction.from;

        var star = this.sky.get(index);
        if (star){
            throw new Error("value has been occupied");
        }
        
        star = new Star();
        star.author = from;
        star.key = index;
        star.x = x;
        star.y = y;
        this.sky.set(index, star);
        this.size++;
        return 1;
    },

    foreach: function() {
        var res = "";
        for (var i=1;i<this.size;i++){
            var res_key = i.toString();
            var res_value = this.sky.get(i);
            if(res === ""){
                res += res_value
            } else {
                res += "-"+res_value;
            }

        }
        return res;
    },

};

module.exports = Contracts;