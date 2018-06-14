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
    } else {
        this.key = "";
        this.create = "";
        this.agree = "";
        this.createtime = "";
        this.agreetime = "";
        this.content = "";
        this.status = "";
    }
};


Contract.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Contracts = function () {
    LocalContractStorage.defineProperty(this, "size", null);
    LocalContractStorage.defineMapProperty(this, "allcontract", {
        parse: function (text) {
            return new Contract(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "agreecontract", {
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


    set: function (agree, content,time) {
        let index = this.size;
        let from = Blockchain.transaction.from;

        let contract = this.allcontract.get(index);
        if (contract){
            throw new Error("value has been occupied");
        }
        
        contract = new Contract();
        contract.key = index;
        contract.create = from;
        contract.agree = agree;
        contract.createtime = time;
        contract.agreetime = "waiting";
        contract.content = content;
        contract.status = "0";
        this.allcontract.set(index, contract);
        this.size++;
        return 1;
    },

    sign: function(id,time) {
        let from = Blockchain.transaction.from;
        let createcontract = this.allcontract.get(parseInt(id));
        if (!createcontract){
            throw new Error("no contrcat");
        } 
        let contract = this.agreecontract.get(parseInt(id));
        if (contract){
            throw new Error("the contract has signed");
        } 

        if (createcontract.agree != from){
            throw new Error("the contract isn't for you");
        } 

        contract = new Contract();
        contract.key = createcontract.key;
        contract.create = createcontract.create;
        contract.agree = from;
        contract.createtime = createcontract.createtime;
        contract.agreetime = time;
        contract.content = createcontract.content;
        contract.status = "1";
        this.agreecontract.set(id, contract);
        return 1;
    },

    foreach: function() {
        let res = "";
        let from = Blockchain.transaction.from;
        for (let i=1;i<this.size;i++){
            let res_key = i.toString();
            let res_value = this.allcontract.get(i);
            if(res_value.create == from || res_value.agree == from){
                if(this.agreecontract.get(i)){
                    res_value = this.agreecontract.get(i)
                }
                if(res === ""){
                    res += res_value
                } else {
                    res += "-"+res_value;
                }
            }

        }
        return res;
    },

    get: function(key) {
        let res = "";
        let contract = this.agreecontract.get(parseInt(key));
        let from = Blockchain.transaction.from;
        let type = "0"
        if(!this.agreecontract.get(parseInt(key))){
            contract = this.allcontract.get(parseInt(key));
            if (contract.agree == from){
                type = "1";
            }

        }
        res = type+"_"+contract;
        return res;
    },

};

module.exports = Contracts;