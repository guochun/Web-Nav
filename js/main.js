!(function (global) {

    function handleKeyPressEvent(obj) {

        document.addEventListener("keypress", function (e) {
            var webURL = obj.keys[e.key].URL;
            if (webURL == false) return;
            webURL = 'http://' + webURL;
            window.open(webURL, '_blank');
        });
    }

    function createButton(text,offset,pressEvent) {
        var btn = document.createElement('button');
        btn.textContent = text;
        if(offset != null) {
            btn.style.top =  (offset.top || 0) + "px";
            btn.style.left = (offset.left || 0) + "px";
        }
        btn.addEventListener('click', pressEvent);
        return btn;
    }

    function setLocalStorage(item,obj) {
        var itemStr = JSON.stringify(obj);
        localStorage.setItem(item,itemStr);
    }

    function getLocalStorage(item) {
        var itemStr = localStorage.getItem(item);
        return JSON.parse(itemStr);
    }
    function ContainStorge(item) {
        return localStorage.getItem(item) != null;
    }
    //键盘对象的构造函数
    function KeyBoard(el, config) {

        this.el = el;
        this.keys = {};
        this.rows = [];

        this.init(config);
        handleKeyPressEvent(this);
    }

    KeyBoard.prototype.init = function (config) {
        var keyArray = config.keys;
        if(!ContainStorge('webURLs')){
            setLocalStorage('webURLs', config.urls);
        }
        var urls = getLocalStorage('webURLs');
        for (var i = 0; i < keyArray.length; i++) {
            var keyrow = keyArray[i];
            for (var j = 0; j < keyrow.length; j++) {
                var pressKey = new PressKey(keyrow[j], urls[keyrow[j]]);
                pressKey.init();
                this.pushKey(i, pressKey);
            }
        }
    }

    KeyBoard.prototype.pushKey = function (rowNumber, key) {
        var row = this.rows[rowNumber];
        if (row == null) {
            row = document.createElement("div");
            row.className = "row";
            this.el.appendChild(row);
            this.rows[rowNumber] = row;
        }
        this.keys[key.text] = key;
        row.appendChild(key.entity);
    }


    //按键对象的构建函数
    function PressKey(text, URL) {

        this.text = text;
        this.URL = URL;
        this.entity;
        this.editorButton;
        this.deleteButton;
        this.icon;
    }

    //创建按键
    PressKey.createKey = function (obj) {
        var key = document.createElement('kbd');
        key.textContent = obj.text;
        key.className = "key";
        key.addEventListener('click', function (el) {
            if (obj.URL === "") return;
            var webURL = "http://" + obj.URL;
            window.open(webURL, '_blank');
        });
        obj.entity = key;
        return key;
    }

    //创建编辑按钮
    PressKey.createEditorButton = function (obj) {

        var editorButton = createButton('E',{top: 2, left: 2},function(e) {
                var inputText = prompt("请输入键位 ["+ obj.text + "]对应的网站地址");
                if(inputText == null || inputText === "" ) return;
                obj.URL = inputText;
                var storeObj = getLocalStorage('webURLs');
                storeObj[obj.text] = obj.URL;
                setLocalStorage('webURLs',storeObj);
                PressKey.updateIcon(obj);
        });

        obj.editorButton = editorButton;
        return editorButton;
    }

    //创建删除按钮
    PressKey.createDeleteButton = function (obj) {

        var deleteButton =  createButton('D',{top: 2, left: 18},function(e){  
            obj.URL = "";      
            PressKey.updateIcon(obj);
        });
        obj.deleteButton = deleteButton;
        return deleteButton;
    }

    //创建图标
    PressKey.createIcon = function(obj) {
        var icon = document.createElement('img');
        obj.icon = icon;
        PressKey.updateIcon(obj);
        icon.addEventListener("error", function(e) {
            e.target.src= 'http://i.loli.net/2017/11/10/5a05afbc5e183.png'
        });
        return icon;
    }

    //更新图标
    PressKey.updateIcon = function(obj) {
        if(obj.URL) {
            obj.icon.src = 'http://' + obj.URL +'/favicon.ico';
        }else{
            obj.icon.src = 'http://i.loli.net/2017/11/10/5a05afbc5e183.png';
        }  
    }

    PressKey.prototype.init = function () {
        var key = PressKey.createKey(this);
        var editorButton = PressKey.createEditorButton(this);
        var deleteButton = PressKey.createDeleteButton(this);
        var icon = PressKey.createIcon(this);
        key.appendChild(editorButton);
        key.appendChild(deleteButton); 
        key.appendChild(icon);
    }

    global.KeyBoard = KeyBoard;

})(this);