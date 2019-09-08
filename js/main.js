paper.install(window);

window.onload = function () {
    const fpURL = 'img/frontpage-1.png';//Front page image

// Initialize annotation text and color
    const annoColor = ["", "violet", "teal", "blue", "red"];
    const annoText = ["null", "Terminal (Cola) Bud", "Small Bud", "Uncertain Bud", "Anomalies"];

    let filename = '';
    let inputAreaX;
    let inputAreaY;

    paper.setup("canvas");

//Initialize Toolbar --------------------------------------------->
    let brushSelected = false;
    let boxSelected = false;
    let canIChooseBrushWidth = false;

    let onBuildingBrushes = false;
    let onBuildingBox = true;


    let brushWidth = 10;

    $("#input-tag").hide();
    $("#brush-width-tool").hide();
    $("#mouse-follow").hide();

    $("#brush-tool").click(function () {

            brushSelected = true;
            boxSelected = false;
            canIChooseBrushWidth = true;
            brushWidth = 20;
            brushToolChoose();

    });

    $("#box-tool").click(function () {
            boxSelected = true;
            brushSelected = false;
            canIChooseBrushWidth = false;
            boxToolChoose();

    });

    $("#export-btn").click(function () {
        exportData();
    });

// Initialize image --------------------------------------------->
    $('#imageLoader')[0].addEventListener('change', importImage, false);


// Grid functions ----------------------------------------------->
    let showGrid = true;
    $('#grid-btn').click(function () {
        if (showGrid){
            showGrid = false;
            $('#grid-img').hide();
        } else {
            showGrid = true;
            $('#grid-img').show();
        }
    });
// Comment functions -------------------------------------------->
    let commentContent = '';
    $('#comment-input').change(function () {
        commentContent = $(this).val();
        console.log(commentContent);
    });

// Filter functions --------------------------------------------->
    let brightIndex = 1;
    let contrastIndex = 100;
    let grayscaleIndex = 0;
    let hueRotateIndex = 0;
    let invertIndex = 0;
    let opacityIndex = 100;
    let saturateIndex = 1;

    let position, sliderNo;
    changeFilter();

    $('#filter-1').click(function () {
        position = $("#filter-1").offset();
        $(".top-slider").hide();
        $("#filter-1-tool").show().css({top: position.top + 60, left: position.left});

        $("#filter-1-slider")[0].oninput = function() {
            sliderNo = Number(this.value);
            if (sliderNo < 50) brightIndex = sliderNo * 0.02;
            else brightIndex = 1 + ((sliderNo - 50) * 0.08);

            changeFilter();
        };
    });

    $('#filter-2').click(function () {
        position = $("#filter-2").offset();
        $(".top-slider").hide();
        $("#filter-2-tool").show().css({top: position.top + 60, left: position.left});

        $("#filter-2-slider")[0].oninput = function() {
            sliderNo = Number(this.value);
            if (sliderNo < 50) contrastIndex = sliderNo * 2;
            else contrastIndex = sliderNo * 3;
            changeFilter();
        };
    });

    $('#filter-3').click(function () {
        position = $("#filter-3").offset();
        $(".top-slider").hide();
        $("#filter-3-tool").show().css({top: position.top + 60, left: position.left});

        $("#filter-3-slider")[0].oninput = function() {
            sliderNo = Number(this.value);
            grayscaleIndex = sliderNo;
            changeFilter();
        };
    });

    $('#filter-4').click(function () {
        position = $("#filter-4").offset();
        $(".top-slider").hide();
        $("#filter-4-tool").show().css({top: position.top + 60, left: position.left});

        $("#filter-4-slider")[0].oninput = function() {
            sliderNo = Number(this.value);
            hueRotateIndex = sliderNo * 1.8;
            changeFilter();
        };
    });

    $('#filter-5').click(function () {
        position = $("#filter-5").offset();
        $(".top-slider").hide();
        $("#filter-5-tool").show().css({top: position.top + 60, left: position.left});

        $("#filter-5-slider")[0].oninput = function() {
            sliderNo = Number(this.value);
            invertIndex = sliderNo;
            changeFilter();
        };
    });

    $('#filter-6').click(function () {
        position = $("#filter-6").offset();
        $(".top-slider").hide();
        $("#filter-6-tool").show().css({top: position.top + 60, left: position.left});

        $("#filter-6-slider")[0].oninput = function() {
            sliderNo = Number(this.value);
            if (sliderNo < 50) saturateIndex = sliderNo * 0.02;
            else saturateIndex = 1 + ((sliderNo - 50) * 0.08);
            changeFilter();
        };
    });

    $('#filter-normal').click(function () {
        $(".top-slider").hide();
        brightIndex = 1;
        contrastIndex = 100;
        grayscaleIndex = 0;
        hueRotateIndex = 0;
        invertIndex = 0;
        opacityIndex = 100;
        saturateIndex = 1;
        changeFilter();
    });

    function changeFilter(){
        let stringbuilt = `brightness(${brightIndex}) 
                               contrast(${contrastIndex}%) 
                               grayscale(${grayscaleIndex}%) 
                               hue-rotate(${hueRotateIndex}deg) 
                               invert(${invertIndex}%) 
                               opacity(${opacityIndex}%) 
                               saturate(${saturateIndex})`;
        $('#raster-img').css({'-webkit-filter': stringbuilt, 'filter': stringbuilt});
    }

// Initialize tool -------------------------------------------->
    let tool = new Tool();
    tool.minDistance = 5;

// Initialize [Brush tool] & [Box tool]
    let brushAnnos = [];
    let boxAnnos = [];

    let brushLayer;
    let brush;

    let box;
    let from, to;

    let boxDraggingLayer = new Layer({
        opacity: 0.5
    });
    let boxLayer = new Layer({
        opacity: 1
    });

//onMouseDown -------------------------------------------------------------------------------------------------> [mouse]
    view.onMouseDown = function (event) {

        if (brushSelected) { //brush tool ------------->
            if (!onBuildingBrushes) {
                $("#input-tag").hide();
                //Create a new layer and new path
                onBuildingBrushes = true;
                brushLayer = new Layer({
                    opacity: 0.5,
                    selectedColor: "hsla(120, 100%, 50%, 0.5)",
                }); //It's like create a new layer in AI, then you will automatically move to the current active layer
            }
            brushLayer.bounds.selected = false;
            brush = new Path({
                strokeCap: 'round',
                strokeJoin: 'round',
                strokeColor: 'black',
                strokeWidth: brushWidth
            });

        } else if (boxSelected && onBuildingBox) { //box tool ------------->
            from = event.point; // Set the beginning point of the box
        }
    };

//onMouseDrag -------------------------------------------------------------------------------------------------> [mouse]
    view.onMouseDrag = function (event) {

        if (brushSelected) {
            $("#input-tag").hide();
            brush.add(event.point);

        } else if (boxSelected && onBuildingBox) {
            $("#input-tag").hide();
            //Dynamic dragging area
            boxDraggingLayer.activate();
            boxDraggingLayer.removeChildren();
            var dragBox = new Path.Rectangle(from, event.point);
            dragBox.fillColor = 'white';
        }
    };

//onMouseUp ---------------------------------------------------------------------------------------------------> [mouse]
    view.onMouseUp = function (event) {

        if (brushSelected) {
            brushLayer.bounds.selected = true;
            //Pop up the selection, if want to end this layer
            if (typeof (brush) != "undefined" && brush.segments.length !== 0) {

                inputAreaX = brushLayer.strokeBounds.bottomLeft.x + 15;
                inputAreaY = brushLayer.strokeBounds.bottomLeft.y + 30;

                showDOMSelection(inputAreaX, inputAreaY);
                $('.selections').hide();
                $('#selection-4').show();
            }

        } else if (boxSelected && onBuildingBox) {
            if (from.x !== event.point.x && from.y !== event.point.y) { // Make sure the beginning point is not end point
                boxDraggingLayer.removeChildren();
                boxLayer.activate();
                box = new Path.Rectangle(new Rectangle(from, event.point));
                box.strokeColor= 'white';
                box.strokeWidth = 2;
                // box.fillColor = "black";
                // box.fillColor.alpha = 0.1;
                // box.bounds.selected = true;

                inputAreaX = box.strokeBounds.bottomLeft.x + 15;
                inputAreaY = box.strokeBounds.bottomLeft.y + 30;
                showDOMSelection(inputAreaX, inputAreaY);
                $('.selections').show();
                $('#selection-4').hide();
                onBuildingBox = false;

            }
        }
    };

//Confirm build button  --------------------------------------------------------------------------------------> [button]
    $(".selections").click(function () {


        //Follow with #input-tag, end this layer and store the annotation
        let annoTextId = Number($(this)[0].id.substring(10));
        let eleId = "";
        let deleteId = "";
        let exportSVG = "";

        if (brushSelected) {
            exportSVG = brushLayer.exportSVG({
                asString: true
            });

            brushAnnos.push({
                id: brushLayer.id,
                annoTextId: annoTextId,
                annotation: annoText[annoTextId],
                paperItem: brushLayer,
                base_64: svgTobase64(exportSVG)
            });
            //Change the color of the layer
            brushLayer.strokeColor = annoColor[annoTextId];
            brushLayer.bounds.selected = false;

            //Show the tag on the ended brush layer
            eleId = "tag-bru-" + brushLayer.id;
            deleteId = "delete-tag-bru-" + brushLayer.id;

            onBuildingBrushes = false;
            brushLayer.onClick = brushLayerEdit;
            brushLayer.onMouseEnter = function () {
                $("#input-tag").hide();
            };
            brushLayer.onMouseEnter = function () {
                $("#show-tag").show();
            };
            brushLayer.onMouseLeave = function () {
                $("#show-tag").hide();
            };

        } else if (boxSelected) {
            exportSVG = box.exportSVG({
                asString: true
            });

            boxAnnos.push({
                id: box.id,
                annoTextId: annoTextId,
                annotation: annoText[annoTextId],
                paperItem: box,
                // base_64: svgTobase64(exportSVG),
                points: {
                    topLeft: {
                        x: box.bounds.topLeft.x,
                        y: box.bounds.topLeft.y
                    },
                    bottomRight: {
                        x: box.bounds.bottomRight.x,
                        y: box.bounds.bottomRight.y
                    }
                }
            });
            //Change the color of the layer
            box.strokeColor = annoColor[annoTextId];

            //Show the tag on the ended brush layer
            eleId = "tag-box-" + box.id;
            deleteId = "delete-tag-box-" + box.id;

            onBuildingBox = true;
            box.onMouseEnter = function () {
                $("#show-tag").show();
            };
            box.onMouseLeave = function () {
                $("#show-tag").hide();
            };
            box.onClick = boxLayerEdit;
        }

        showDOMTag(inputAreaX, inputAreaY + 10, eleId, deleteId,
            annoColor[annoTextId], annoText[annoTextId]);

        printObjects();

    });

//Delete tag button  -----------------------------------------------------------------------------------------> [button]
    $("#show-tag").on("click", "i", function () {
        let annoType = $(this)[0].id.substring(11, 14);
        let annoId = Number($(this)[0].id.substring(15));

        removeAnno(annoType, annoId);
    });

    function removeAnno(annoType, annoId) {
        /** Steps (something need to be done when you wanna delete an annotation):
         [1]. Pointer the annotation array object according to annoType(brush or box)
         [2]. Delete the paper object from the anno array
         [3]. Remove the paper object from the workplace
         [4]. Remove the tag in the DOM */

        let paperObjTobeRemove = {};
        if (annoType === 'bru') {
            brushAnnos.forEach(function (ele) {
                if (ele.id === annoId) {
                    paperObjTobeRemove = ele.paperItem;
                }
            });
            brushAnnos = brushAnnos.filter(function (ele) {
                return Number(ele.id) !== annoId;
            });
        } else if (annoType === 'box') {
            boxAnnos.forEach(function (ele) {
                if (ele.id === annoId) {
                    paperObjTobeRemove = ele.paperItem;
                }
            });
            boxAnnos = boxAnnos.filter(function (ele) {
                return Number(ele.id) !== annoId;
            });
        }
        paperObjTobeRemove.remove();
        $("#show-tag").children().remove("#" + "tag-" + annoType + "-" + annoId);

        printObjects();
    }

    function brushLayerEdit(event) {
        if (brushSelected) {
            /** Steps (something need to be done when you wanna editing a built pattern):
             [1]. Change variable [brushLayer] to [this]
             [2]. Active current layer
             [3]. Trigger[onBuildingBrushes] is true (means it's on editing status)
             [4]. Renew the DOM [#tag-x] information (remove and it will generate new lately)
             [5]. Renew [brushAnnos] (remove and it will generate new lately)
             [6]. Show selection buttons again */

            brushSelected = true;
            boxSelected = false;
            this.opacity = 0.5;
            this.selectedColor = "hsla(120, 100%, 50%, 0.5)";

            brushLayer = this;
            onBuildingBrushes = true;

            this.strokeColor = 'black';
            this.bounds.selected = true;
            this.activate();
            let activeId = this.id;

            //Remove previous tag [DOM element] ---------------------------------> [4]
            $("#show-tag").children().remove("#tag-bru-" + activeId);

            //Remove the corresponding object in [brushAnnos] -------------------> [5]
            brushAnnos = brushAnnos.filter(function (ele) {
                return ele.id !== activeId;
            });

            //Remove the corresponding object in [brushAnnos] -------------------> [6]
            inputAreaX = brushLayer.strokeBounds.bottomLeft.x + 15;
            inputAreaY = brushLayer.strokeBounds.bottomLeft.y + 30;
            showDOMSelection(inputAreaX, inputAreaY);
            $('.selections').hide();
            $('#selection-4').show();

            $('html').keyup(function(e) {
                if(Number(e.keyCode) === 8) {
                    brushLayer.remove();
                    onBuildingBrushes = false;

                    $("#input-tag").hide();
                }
            });
        }
        printObjects();
    }


    function boxLayerEdit() {
        if (boxSelected) {

            this.strokeColor = 'white';

            brushSelected = false;
            boxSelected = true;
            box = this;
            let activeId = this.id;

            $("#show-tag").children().remove("#tag-box-" + activeId);
            boxAnnos = boxAnnos.filter(function (ele) {
                return ele.id !== activeId;
            });

            console.log('yes!');

            inputAreaX = box.strokeBounds.bottomLeft.x + 15;
            inputAreaY = box.strokeBounds.bottomLeft.y + 30;
            showDOMSelection(inputAreaX, inputAreaY);
            $('.selections').show();
            $('#selection-4').hide();

            $('html').keyup(function(e) {
                if(Number(e.keyCode) === 8) {
                    box.remove();
                    $("#input-tag").hide();
                    onBuildingBox = true;
                }
            });
        }
        printObjects();
    }

    function showDOMSelection(inputAreaX, inputAreaY) {
        $("#input-tag").show()
            .css({"left": inputAreaX, "top": inputAreaY, "position": "absolute"});
    }

    function showDOMTag(x, y, eleId, deleteId, colorClass, text) {
        $("#show-tag").append(
            "<div id='" + eleId + "' class='ui " + colorClass + " label'>" + text +
            "</div>");

        $("#" + eleId)
            .css({
                "left": x,
                "top": y,
                "position": "absolute",
                "z-index": 2
            });

        $("#input-tag").hide();
        $("#show-tag").hide();
    }

    function printObjects() {
        console.log("PRINT-------------->");
        console.log("Brush =========>");
        console.log(brushAnnos);
        console.log("Box ===========>");
        console.log(boxAnnos);
        renderStatis();
    }

//Export / Import -------------------------------------------------------------------------------------------------> [button]
    function importImage(e){
        let reader = new FileReader();
        reader.onload = function(){
            $('#raster-img').attr("src",reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        filename = e.target.files[0].name;
        console.log(filename);
    }

    function exportData() {
        //Design the schema of exportData
        let exportObject = {
            imgURL: "",
            brushAnno: {
                anomaly: [] // pixel data of brush annotations
            },
            boxAnno: {
                terminalBud: [], smallBud: [], uncertainBud: [] // endpoints of box annotations
            },
            comment: "" // other comments in case
        };
        exportObject.imgURL = filename;
        brushAnnos.forEach(function (ele) {
            let base64 = ele.base_64;
            if (ele.annoTextId === 1) {
                exportObject.brushAnno.terminalBud.push(base64);
            } else if (ele.annoTextId === 2) {
                exportObject.brushAnno.smallBud.push(base64);
            } else if (ele.annoTextId === 3) {
                exportObject.brushAnno.uncertainBud.push(base64);
            } else if (ele.annoTextId === 4) {
                exportObject.brushAnno.anomaly.push(base64);
            }
        });
        boxAnnos.forEach(function (ele) {
            let points = ele.points;
            if (ele.annoTextId === 1) {
                exportObject.boxAnno.terminalBud.push(points);
            } else if (ele.annoTextId === 2) {
                exportObject.boxAnno.smallBud.push(points);
            } else if (ele.annoTextId === 3) {
                exportObject.boxAnno.uncertainBud.push(points);
            } else if (ele.annoTextId === 4) {
                exportObject.boxAnno.anomaly.push(points);
            }
        });
        exportObject.comment = commentContent;
        console.log("Export JOSN!");
        exportToJsonFile(exportObject);
    }

    $("#test").click(function () {
        renderStatis();
    });

    function renderStatis(){
        let stat1 = 0;
        let stat2 = 0;
        let stat3 = 0;
        let stat4 = 0;
        let totalStat = 0;
        brushAnnos.forEach(function (ele) {

            if (ele.annoTextId === 1) {
                $("#anno-1-number").html()
            } else if (ele.annoTextId === 2) {

            } else if (ele.annoTextId === 3) {

            } else if (ele.annoTextId === 4) {
                stat4++;
            }
        });
        boxAnnos.forEach(function (ele) {
            let points = ele.points;
            if (ele.annoTextId === 1) {
                stat1++;
            } else if (ele.annoTextId === 2) {
                stat2++;
            } else if (ele.annoTextId === 3) {
                stat3++;
            } else if (ele.annoTextId === 4) {

            }
        });
        totalStat = stat1 + stat2 + stat3 + stat4;
        $("#anno-1-number").html(stat1);
        $("#anno-2-number").html(stat2);
        $("#anno-3-number").html(stat3);
        $("#anno-4-number").html(stat4);
        $("#anno-0-number").html(totalStat);
    }

    function exportToJsonFile(jsonData) {
        let dataStr = JSON.stringify(jsonData);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = encodeImgName(filename) + '_annotation.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }



//Convert base-64 ----------------------------------------------------------------------------------------------------> [button]
    $("#drawingArea").hide();
    $("#export-svg").click(function () {

        var raster = new Raster({
            source: $('#raster-img')[0].src,
            position: view.center
        });

        raster.width = 1368;
        raster.height = 912;

        raster.sendToBack();

        console.log("save png");
        let exportSVG = project.exportSVG({
            asString: true
        });

        console.log(exportSVG);

        // var url = "data:" + encodeURIComponent(exportSVG);
        //
        // var link = document.createElement("a");
        // link.download = "example11111.svg";
        // link.href = url;
        // link.click();

        // let imgURL = svgTobase64(exportSVG);
        //
        // let exportFileDefaultName = encodeImgName(filename) + '.png';
        //
        // let linkElement = document.createElement('a');
        // linkElement.setAttribute('href', imgURL);
        // linkElement.setAttribute('download', exportFileDefaultName);
        // linkElement.click();

        raster.remove();
    });

    $("#export-png").click(function () {

        console.log("save png");
        let exportSVG = project.exportSVG({
            asString: true
        });

        console.log(exportSVG);
        let imgURL = svgTobase64(exportSVG);

        let exportFileDefaultName = encodeImgName(filename) + '.png';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', imgURL);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    function encodeImgName(filename) {
        // let b = filename.indexOf("=");
        let n = filename.indexOf(".");
        return filename.substring(0, n);
    }

    function svgTobase64(exportSVG) {
        let svgHeader = '<svg width="1368" height="912" xmlns="http://www.w3.org/2000/svg">';
        let svgFooter = '</svg>';
        exportSVG = svgHeader + exportSVG + svgFooter;

        canvg(document.getElementById('drawingArea'), exportSVG);

        let canvas = document.getElementById("drawingArea");
        return canvas.toDataURL("image/png");
    }

//DOM style functions ------------------------------------------------------------------------------------------------> [DOM]

    function brushToolChoose(){
        $("#box-icon").removeClass("green").addClass("white");
        $("#brush-icon").removeClass("white").addClass("green");

        $("#box-tool-txt").css({"color": "white"});
        $("#brush-tool-txt").css({"color": "green"});

        changeBrushWidth();

        $("#mouse-follow").show();
        $(document).mousemove(function(e){
            let stringBuilt = $("#mouse-follow").css("border");
            let b = stringBuilt.indexOf('p');
            stringBuilt = Number(stringBuilt.substring(0, b));

            $("#mouse-follow").css({left: e.pageX - stringBuilt, top: e.pageY - stringBuilt});
        });
    }

    function boxToolChoose(){
        $("#box-icon").removeClass("white").addClass("green");
        $("#brush-icon").removeClass("green").addClass("white");

        $("#box-tool-txt").css({"color": "green"});
        $("#brush-tool-txt").css({"color": "white"});

        $(".brush-width-show").hide();
        $("#brush-tool").show();

        $(".top-slider").hide();
        $('#mouse-follow').hide();
    }

    function changeBrushWidth() {
        let position = $("#brush-tool").offset();
        $(".top-slider").hide();
        $("#brush-width-tool").show().css({top: position.top + 60, left: position.left});
        $("#slider")[0].oninput = function() {
            let sliderNo = Number(this.value);

            brushWidth = Number(this.value);
            let styleBuilt = (Number(this.value) / 2) + 'px solid white';
            // console.log(styleBuilt);
            $('#mouse-follow').show().css({border: styleBuilt});
        };
    }
};