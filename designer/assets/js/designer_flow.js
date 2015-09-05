/**
 * Created by jupox on 06/08/15.
 */
var imgPath = '../../static/img/';
var instance;
var objectsRaw;

(function ($) {
    //------------- Check all Checkboxes -------------//
    // Detect touch support
    $.support.touch = 'ontouchend' in document;
    // Ignore browsers without touch support
    if (!$.support.touch) {
    return;
    }
    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        touchHandled;

    function simulateMouseEvent (event, simulatedType) { //use this function to simulate mouse event
    // Ignore multi-touch events
        if (event.originalEvent.touches.length > 1) {
        return;
        }
    event.preventDefault(); //use this to prevent scrolling during ui use

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
        simulatedType,    // type
        true,             // bubbles
        true,             // cancelable
        window,           // view
        1,                // detail
        touch.screenX,    // screenX
        touch.screenY,    // screenY
        touch.clientX,    // clientX
        touch.clientY,    // clientY
        false,            // ctrlKey
        false,            // altKey
        false,            // shiftKey
        false,            // metaKey
        0,                // button
        null              // relatedTarget
        );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
    }
    mouseProto._touchStart = function (event) {
    var self = this;
    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
        return;
        }
    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;
    // Track movement to determine if interaction was a click
    self._touchMoved = false;
    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');
    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
    };

    mouseProto._touchMove = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
        return;
        }
    // Interaction was not a click
    this._touchMoved = true;
    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
    };
    mouseProto._touchEnd = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
        return;
    }
    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');
    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');
    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {
      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }
    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
    };
    mouseProto._mouseInit = function () {
    var self = this;
    // Delegate the touch handlers to the widget's element
    self.element
        .on('touchstart', $.proxy(self, '_touchStart'))
        .on('touchmove', $.proxy(self, '_touchMove'))
        .on('touchend', $.proxy(self, '_touchEnd'));

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
    };

})(jQuery);

var dictObj = {};
jsPlumb.ready(function () {
    console.log("Scene Ready");
    // Get dictObj Ajax json - dict

    // setup some defaults for jsPlumb.
     instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            [ "Label", { label: "Empty", id: "label", cssClass: "aLabel" }]
        ],
        Container: "sceneBox"
    });

    window.jsp = instance;

    $.get('/nodes', function( data ) {
        if (data.length == 0){
            dictObj = {"0":{"code":"0","color":"text-danger","connects":{},"height":"100px","isTarget":"true","properties":"","name":"end","maxOut":0,"topY":"","parameters":0,"isSource":"false","leftX":"","maxIn":1,"id":"end_","width":"100px","icon":"fa fa-phone-square"},"17":{"code":"17","color":"text-success","connects":{},"height":"100px","isTarget":"true","properties":"<div class=\"modal fade\" id=\"{0}Prop\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                    <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel2\">Transfer</h4>\n            </div>\n            <div class=\"modal-body\" id=\"contentProperties\">\n               <form id=\"{0}Form\" class=\"form-horizontal group-border stripped\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Destination code:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"transfer_destcode\" value=\"{1}\">\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>","name":"transfer","maxOut":0,"topY":"","parameters":1,"isSource":"false","leftX":"","maxIn":5,"id":"transfer_","width":"100px","icon":"fa fa-send-o"},"18":{"code":"18","color":"text-info","connects":{"next":""},"height":"100px","isTarget":"true","properties":"<div class=\"modal fade\" id=\"{0}Prop\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                    <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel2\">TTs</h4>\n            </div>\n            <div class=\"modal-body\" id=\"contentProperties\">\n               <form id=\"{0}Form\" class=\"form-horizontal group-border stripped\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Text:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"tts_text\" value=\"{1}\">\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>","name":"tts","maxOut":1,"topY":"","parameters":1,"isSource":"true","leftX":"","maxIn":5,"id":"rec_","width":"100px","icon":"fa fa-text-width"},"19":{"code":"19","color":"text-dark","connects":{"next":""},"height":"100px","isTarget":"true","properties":"<div class=\"modal fade\" id=\"{0}Prop\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                    <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel2\">Video</h4>\n            </div>\n            <div class=\"modal-body\" id=\"contentProperties\">\n                <form id=\"{0}Form\" class=\"form-horizontal group-border stripped\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Video:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <select class=\"form-control\" id=\"select_name_video_{0}\" onchange=\"selectOption('{0}','video',this.value)\">\n                            </select>\n                        </div>\n                    </div>\n                    <input type=\"hidden\" class=\"form-control\" id=\"name_{0}\" name=\"video_name\" value=\"{1}\">\n                    <input type=\"hidden\" class=\"form-control\" id=\"url_{0}\" name=\"video_url\" value=\"{2}\">\n                    <input type=\"hidden\" class=\"form-control\" id=\"id_{0}\" name=\"video_id\" value=\"{3}\">\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>","name":"video","maxOut":1,"topY":"","parameters":1,"isSource":"true","leftX":"","maxIn":5,"id":"video_","width":"100px","icon":"fa fa-video-camera"},"11":{"code":"11","color":"text-success","connects":{"next":""},"height":"100px","isTarget":"false","properties":"","name":"answer","maxOut":1,"topY":"","parameters":0,"isSource":"true","leftX":"","maxIn":0,"id":"answer_","width":"100px","icon":"fa fa-phone"},"12":{"code":"12","color":"text-primary","connects":{"next":""},"height":"100px","isTarget":"true","properties":"<div class=\"modal fade\" id=\"{0}Prop\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                    <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel2\">Audio</h4>\n            </div>\n            <div class=\"modal-body\" id=\"contentProperties\">\n               <form id=\"{0}Form\" class=\"form-horizontal group-border stripped\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Audio:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <select class=\"form-control\" id=\"select_name_audio_{0}\" onchange=\"selectOption('{0}','audio',this.value)\">\n                            </select>\n                        </div>\n                    </div>\n                    <input type=\"hidden\" class=\"form-control\" id=\"name_{0}\" name=\"audio_name\" value=\"{1}\">\n                    <input type=\"hidden\" class=\"form-control\" id=\"url_{0}\" name=\"audio_promp_path\" value=\"{2}\">\n                    <input type=\"hidden\" class=\"form-control\" id=\"id_{0}\" name=\"audio_id\" value=\"{3}\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Escape digits:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"audio_escape\" value=\"{4}\">\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>","name":"audio","maxOut":1,"topY":"","parameters":4,"isSource":"true","leftX":"","maxIn":5,"id":"audio_","width":"100px","icon":"fa fa-music"},"13":{"code":"13","color":"text-warning","connects":{"11":"","10":"","1":"","0":"","3":"","2":"","5":"","4":"","7":"","6":"","9":"","8":""},"height":"100px","isTarget":"true","properties":"<div class=\"modal fade\" id=\"{0}Prop\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                    <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel2\">Digits</h4>\n            </div>\n            <div class=\"modal-body\" id=\"contentProperties\">\n               <form id=\"{0}Form\" class=\"form-horizontal group-border stripped\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Audio:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <select class=\"form-control\" id=\"select_name_audio_{0}\" onchange=\"selectOption('{0}','audio',this.value)\">\n                            </select>\n                        </div>\n                    </div>\n                    <input type=\"hidden\" class=\"form-control\" id=\"name_{0}\" name=\"audio_name\" value=\"{1}\">\n                    <input type=\"hidden\" class=\"form-control\" id=\"url_{0}\" name=\"audio_promp_path\" value=\"{2}\">\n                    <input type=\"hidden\" class=\"form-control\" id=\"id_{0}\" name=\"audio_id\" value=\"{3}\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Min no of digits expected:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"digits_min_digits_expected\" value=\"{4}\">\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Max no of digits expected:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"digits_max_digits_expected\" value=\"{5}\">\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Expected digits:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"digits_expected\" value=\"{6}\">\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Retries:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"digits_retries\" value=\"{7}\">\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Retry timeout (in seconds):</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"digits_retry_timeout\" value=\"{8}\">\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>","name":"digit","maxOut":10,"topY":"","parameters":8,"isSource":"true","leftX":"","maxIn":5,"id":"digit_","width":"100px","icon":"fa fa-fax"},"14":{"code":"14","color":"text-danger","connects":{"next":""},"height":"100px","isTarget":"true","properties":"<div class=\"modal fade\" id=\"{0}Prop\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                    <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                </button>\n                <h4 class=\"modal-title\" id=\"myModalLabel2\">Record</h4>\n            </div>\n            <div class=\"modal-body\" id=\"contentProperties\">\n               <form id=\"{0}Form\" class=\"form-horizontal group-border stripped\">\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Record File Path:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"rec_file_path\" value=\"{1}\">\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Escape digits:</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"rec_escape_digits\" value=\"{2}\">\n                        </div>\n                    </div>\n                    <div class=\"form-group\">\n                        <label class=\"col-lg-4 col-md-3 control-label\" for=\"\">Timeout (in seconds):</label>\n                        <div class=\"col-lg-8 col-md-9\">\n                            <input type=\"text\" class=\"form-control\" name=\"rec_timeout\" value=\"{3}\">\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n            </div>\n        </div>\n    </div>\n</div>","name":"rec","maxOut":1,"topY":"","parameters":3,"isSource":"true","leftX":"","maxIn":5,"id":"rec_","width":"100px","icon":"fa fa-microphone"}};
        }else{
            dictObj = data;
        }
        if (objectsRaw) {
            oraw = JSON.parse(objectsRaw);
            console.log(oraw);
            imgPath = '../../../static/img/';
            //For nodes
            for (var i = 0; i < oraw.data.length; i++) {
                var xAux = oraw.data[i].positionX;
                var yAux = oraw.data[i].positionY;

                var dataAux = dictObj[oraw.data[i].alt];
                var paramsAux = getParametersArray(oraw.data[i].properties)
                var idObjAux = oraw.data[i].objId;
                var objAux = new newObj(idObjAux, dataAux, xAux, yAux,paramsAux,oraw.data[i].alt );
                objAux.draw();

            }
            //For Connections
            for (var i = 0; i < oraw.data.length; i++) {
                var conAux = oraw.data[i].connects;
                for (var j = 0; j < conAux.length; j++) {
                    // and finally, make a couple of connections
                    connAux = instance.connect({ uuids:[conAux[j].pageSourceId+"sourceEP",conAux[j].pageTargetId+"targetEP"] });
                    connAux.getOverlay("label").setLabel(conAux[j].option);

                    parameters = connAux.getParameters();
                    opt = conAux[j].option.split(',');
                    for (var k = 0; k < opt.length; k++){
                        var val = opt[k];
                        switch (opt[k]){
                            case '*':
                                val = '10';
                                break;
                            case '#':
                                val = '11';
                                break;

                        }
                        parameters[val] = conAux[j].pageTargetId;
                    }
                }
            }

            jsPlumb.fire("jsPlumbDemoLoaded", instance);
        }
    }, "json");

});

function existNode(code) {
    if (code == '11'){
        nodes = $("#sceneBox").find('div');
        for (var i =0; i<nodes.length;i++){
            if ($(nodes[i]).attr('alt') == code){
                return false;
            }
        };

    };

    return true;
};

var i = 1;
$(function () {

    //Make element draggable
    $(".obj").draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit',
        revert: false
    });

    $("#sceneBox").droppable({
        accept: '.obj',
        activeClass: "drop-area",
        drop: function (e, ui) {

            console.log(e);
            xx = ui.helper.clone();
            if (existNode(xx.attr('alt')))
            {

                element = document.getElementById('sceneBox');
                position = element.getBoundingClientRect();
                var dropPositionX = e.pageX - $(this).offset().left;
                var dropPositionY = e.pageY - $(this).offset().top;
                // Get mouse offset relative to dragged item:
                if (e.offsetX == undefined) // this works for Firefox
                {
                    //FIREFOX BUGFIX
                    xpos = e.pageX - $('#sceneBox').offset().left;
                    ypos = e.pageY - $('#sceneBox').offset().top;
                }
                else                     // works in Google Chrome
                {
                    xpos = dropPositionX - e.offsetX;
                    ypos = dropPositionY - e.offsetY;
                }

                // Get position of dragged item relative to drop target:
                var x = xpos;
                var y = ypos;



                var data = dictObj[xx.attr('alt')];

                //var pos = ui.draggable.offset(), dPos = $(this).offset();
                var idObj = data['id'] + i;
                var obj = new newObj(idObj,data, x, y,[],xx.attr('alt'));
                obj.draw();

                i++;
                ui.helper.remove();
            }
        }
    });
});

var pparams;
var e1;
var e2;
var newObj = function(id,data,x,y,prop,id_node){
    var self = {
        id : id,
        data : data,
        x:x,
        y:y,
        prop:prop,
        code:id_node,
        draw:function(){
            self.data["id"] = self.id;

            if (self.prop.length == 0){
                self.prop = getParameters_initialize(self.data['parameters']);
            }
            var propertiesNode= String.format(self.data['properties'],self.id,self.prop);

            $("#propBox").append(propertiesNode);

            self.obj =  $('<div>').attr('id', self.data['id']).attr('alt', self.code).addClass('w');

            label =document.createElement('label');
            label.setAttribute("class","nameObj");
            label.innerHTML = self.data["name"];

            iconObj = $('<div>').attr('id', 'ico'+self.data['id']).attr("class",'objIcoContent text-center');
            iconObj.attr("ondblclick", 'openProperties('+"'"+self.data['id']+'Prop'+"'"+')' );
            imageObj = $('<i>').attr("class",'objIco center-block '+ self.data['icon']+' fa-3x '+ self.data['color']);
            iconObj.append(imageObj);
            iconObj.append(label);

            linkDelObj = $('<a>').addClass('delLink');
            linkDelObj.attr("href","Javascript:removeObjId('"+self.data['id']+"')");

            imageDelObj = $('<i>').addClass('deleteIco');
            imageDelObj.attr("width","12px");
            imageDelObj.attr("height","12px");
            imageDelObj.attr("class","fa fa-times text-danger  icoDelObj");

            linkDelObj.append(imageDelObj);

            connector =$('<div>').addClass('ep');




            // Get mouse position relative to drop target:
            self.obj.css({
                'top': self.y,
                'left': self.x
            });

            self.obj.append(linkDelObj);
            self.obj.append(iconObj);
            self.obj.appendTo('#sceneBox');


            //Audio and Video
            if (self.code == "12" || self.code == "13" ){
                loadOptions(self.id,"audio",self.prop[0]);
            }else if( self.code == "19"){
                loadOptions(self.id,"video",self.prop[0]);
            }

            var newObj = jsPlumb.getSelector("#"+self.data['id']);
            instance.draggable(newObj);

            instance.bind("beforeDrop", function (params) {
            // console.log("before drop: " + info.sourceId + ", " + info.targetId);
                if (pparams == undefined){
                            pparams = params;
                        }else if (pparams.sourceId == params.sourceId){
                            params.connection.setParameters(pparams.connection.getParameters());
                            pparams = params;
                        }else{
                            pparams = params;
                        }

                        if (instance.getConnections({
                            "source":params.sourceId,
                            "target":params.targetId
                        }).length > 0 || params.sourceId == params.targetId || params.sourceId == undefined){
                            return false
                        }

                        var pp = pparams.connection.getParameters();

                        console.log(pp);
                        if (Object.keys(pp).length == 1){
                            pp.next = pparams.targetId;
                            params.connection.getOverlay("label").setLabel("Next");
                        }else{
                            instance.getConnections().forEach(function(b){
                                if (b.sourceId == params.sourceId){
                                    ap = b.getParameters()
                                     for (cnt in ap){
                                         if (ap[cnt] != ""){
                                             delete pp[cnt];
                                         }
                                     }
                                }

                            });
                            html = '<div class="children">';
                            for (cnt in pp){
                                idLabel = cnt;
                                if (cnt =="10"){
                                    idLabel="*";
                                }else if (cnt =="11")
                                {
                                    idLabel="#";
                                }
                                if (pp[cnt] == ""){
                                    html += String.format('\
                                    <div class="checkbox-custom">\
                                        <input class="" id="cnt{0}" value="{2}" type="checkbox" onclick="Javascript:setConnection(this,\'{1}\',\'{0}\')">\
                                        <label class="" for="">{2}</label>\
                                        <label class="" id="label{2}"></label>\
                                    </div>\
                                    ',cnt,pparams.targetId,idLabel);
                                }else{
                                    html += String.format('\
                                    <div class="checkbox-custom">\
                                        <input class="" id="cnt{0}" value="{0}" type="checkbox" checked onchange="Javascript:setConnection(this,\'{1}\',\'{0}\')">\
                                        <label class="" for="cnt{0}">{2}</label>\
                                        <label class="" id="label{2}">{3}</label>\
                                    </div>\
                                    ',cnt,pparams.targetId,idLabel,pp[cnt]);
                                }
                            }
                            html += '</div>'
                            $("#checkAllConnects").html(html);
                            $('#connectsModal').modal('show');
                        }

                        return true
            });

            if (self.data["isTarget"] == "true") {
                var targetOptions = {
                    isSource: false,
                    isTarget: true,
                    detachable: true,
                    uniqueEndpoint:true,
                    endpoint: "Rectangle",
                    paintStyle:{ fillStyle:'#FFF',height:30,width:10},
                    style: {fillStyle: 'blue'},
                    maxConnections: self.data['maxIn'],
                    connector: ["StateMachine", {curviness: 5}],
                    connectorStyle: {
                        strokeStyle: "#5c96bc",
                        lineWidth: 2,
                        outlineColor: "transparent",
                        outlineWidth: 4
                    },
                    scope: "blueline",
                    anchor: ["Left", "Continuous"],

                    onMaxConnections:function(info, e) {
                                alert("Source connection allow(" + info.maxConnections + ")");
                    },

                    dropOptions: {
                        drop: function (e, ui) {
                            alert('Warning: option no valid');
                        }
                    }
                };
                e2 = instance.addEndpoint(newObj, {uuid: self.data["id"]+"targetEP"}, targetOptions);
            }
            if (self.data["isSource"] == "true"){
                var sourceOptions = {
                    isSource:true,
                    isTarget:false,
                    endpoint:"Rectangle",
                    paintStyle:{ fillStyle:'#FFF',height:30,width:10},
                    style:{ fillStyle:'blue' },
                    maxConnections:self.data['maxOut'],
                    connector : ["StateMachine", { curviness: 5 }],
                    connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
                    scope:"blueline",
                    anchor: ["Right", "Continuous"],

                    dropOptions:{
                          drop:function(e, ui) {
                            alert('Warning: Option no valid');
                          }
                      }
                };
                e1 = instance.addEndpoint(newObj, {
                    uuid: self.data["id"]+"sourceEP",
                    parameters: self.data["connects"]
                }, sourceOptions );
            }


            i++;
            return newObj;
        }

    }

    return self
}

function openProperties(id) {
    $("#"+id).modal('show');
};

function removeObjId(idObj){

    instance.deleteEndpoint(idObj+"sourceEP");
    instance.deleteEndpoint(idObj+"targetEP");
    instance.detachAllConnections(idObj);
    $('#'+idObj).remove();
    $('#'+idObj+"Prop").remove();


}

function setConnection(chk, target, id){
    parameters = pparams.connection.getParameters();
    idLabel = id;

    if (id =="10"){
        idLabel="*";
    }else if (id =="11")
    {
        idLabel="#";
    }
    idsChecked = ""
    $('#checkAllConnects input:checked').each(function() {
        idsChecked += $(this).val()+",";
    });

    if ( $(chk).is(':checked')){
        $(chk).value = target;
        $("#label"+id).text(target);
        parameters[id] = target;
        pparams.connection.getOverlay("label").setLabel(idsChecked);
    }else{
        idsChecked = ""
        $('#checkAllConnects input:checked').each(function() {
            idsChecked += $(this).val()+",";
        });
        parameters[id] = '';
        pparams.connection.getOverlay("label").setLabel(idsChecked);

        $(chk).value = "";
        $("#label"+id).text("");
    }

    pparams.connection.setParameters(parameters);
    console.log(parameters);
}

function saveIvrApp(){
    var raw = {};
    var parsed = {};
    var app = [];
    nameApp = $("#nameApp").val();
    if (nameApp != ""){
        $("#sceneBox .w").each(function (idx, elem) {
            var $elem = $(elem);

            var connections = [];
            $.each(instance.getConnections({
                "source":$elem.attr('id')
            }), function (idx, connection) {
                connections.push({
                    connectionId: connection.id,
                    pageSourceId: connection.sourceId,
                    pageTargetId: connection.targetId,
                    option: connection.getOverlay("label").getLabel()
                });
            });
            app.push({
                objId: $elem.attr('id'),
                alt: $elem.attr('alt'),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10),
                connects: connections,
                properties: $("#"+$elem.attr('id')+"Form").serialize()
            });

        });
        raw["data"] = app;
        rawJson = JSON.stringify(raw);
        console.log(rawJson);

        //Get first node = Answer
        parsed = getObj(raw,findNodeId(raw,'11'));
        parsedJson = JSON.stringify(parsed);
        console.log(parsedJson);

        var f = $("#ivr_designer_form");
        f.append(String.format("<input type='hidden' name='raw' value='{0}'>",rawJson));
        f.append(String.format("<input type='hidden' name='parsed' value='{0}'>",parsedJson));
        $('form#ivr_designer_form').submit();

    }else{
        $.gritter.add({
            title: 'App Name:',
            text: 'Name can\'t be empty',
            close_icon: 'l-arrows-remove s16'
        });
    }


}
function getObj(raw,node){
    var nodeObj = {};
    nodeObj[node.objId.split('_')[0]] ={
        "parameters":getParameters(node.properties),
        "connectors":getConnectors(raw,node.connects)
    };
    return nodeObj;
}
function getConnectors(raw,connectors){
    var con = "";
    if (connectors != undefined) {
        if (connectors.length > 0) {
            con = {};
            for (var i=0; i<connectors.length;i++) {
                if (connectors[i].option != "Next"){
                    con[connectors[i].option.replace(/,\s*$/, "")]=(getObj(raw,findNodeName(raw,connectors[i].pageTargetId)));
                }else{
                    con = getObj(raw,findNodeName(raw,connectors[i].pageTargetId))
                }
            }
        }
    }
    return con;
}
function getParameters(params){
    var paramsReturn = "";
    if (params != undefined && params != ""){
        paramsReturn = {};
        dparams = params.split("&");
        for (var d=0; d<dparams.length;d++){
            dp = dparams[d].split("=");
            paramsReturn[dp[0]]=decodeURIComponent(dp[1]);
        }
    }
    return paramsReturn
}
function getParametersArray(params){
    var paramsReturn = "";
    if (params != undefined && params != ""){
        paramsReturn = [];
        dparams = params.split("&");
        for (var d=0; d<dparams.length;d++){
            dp = dparams[d].split("=");
            paramsReturn.push(decodeURIComponent(dp[1]));
        }
    }
    return paramsReturn
}

function getParameters_initialize(length){
    var params = [];
    for (var i =0; i < length; i++){
        params.push("");
    }
    return params
}

function findNodeId(app,nodeId){
    for (var i=0; i<app.data.length;i++){
        if (app.data[i].alt == nodeId){
            return app.data[i];
        }
    }
}
function findNodeName(app,nodeName){
    for (var i=0; i<app.data.length;i++){
        if (app.data[i].objId == nodeName){
            return app.data[i];
        }
    }
}

function loadOptions(id,type, opt){
    //Ajax - load data
    var url = "/api/media_management/assets/"+type+"/";
    var html = '<option value="">---</option>';
    var type_data = type;
    $("#select_name_"+type_data+"_"+id).html(html);
    $.getJSON(url, function (json) {
        for(data in json){
            select = ""
            if (opt.replace(/\+/g,' ') == json[data].name){
                select = "selected";
                selectOption(id,type_data,String.format('{0}|{1}|{2}',json[data].id,json[data].name,json[data].url));
            }
            html += String.format('\
            <option {3} value="{0}|{1}|{2}">{1}</option>\
            ',json[data].id,json[data].name,json[data].url, select)
        }
        $("#select_name_"+type_data+"_"+id).html(html);
        type_data = "";
    });

}

function selectOption(id,type, opt){
    //split opt value
    values = opt.split('|');
    $("#name_"+id).val(values[1]);
    $("#url_"+id).val(values[2]);
    $("#id_"+id).val(values[0]);
}