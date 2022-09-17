import MousePosition from "ol/control/MousePosition";
import {format} from 'ol/coordinate';
import {FullScreen, ScaleLine} from "ol/control";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import "ol-ext/dist/ol-ext.css";
import '../css/custom_layerswitcher.css';
import {Group, Vector} from "ol/layer";
import LegendRenderer from "geostyler-legend/dist/LegendRenderer/LegendRenderer";
import Legend from "ol-ext/legend/Legend";

class OLControls {
    map = null;

    constructor(map) {
        this.map = map;
        let lswitcher = new LayerSwitcher({
            // target: $(".layerSwitcher").get(0),
            // extent: true,
            // trash: true,
            oninfo: function (l) {
                alert(l.get("title"));
            }
        });
        let btn = document.createElement("button");
        btn.innerHTML = "Submit";
        btn.type = "submit";
        btn.name = "formBtn";
        lswitcher.on('drawlist', function (e) {
            var layer = e.layer;
            let btn = document.createElement("IMG")
            btn.alt = "Save";
            btn.src = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
            btn.width = 50
            btn.height = 30
            btn.onclick = function () {
                let f = layer.getSource().features[0]
                let img = Legend.getLegendImage({
                    /* given a style  and a geom type
                    style: f.getStyle() || getFeatureStyle(f),
                    typeGeom: f.getGeometry().getType()
                    */
                    /* or given a feature */
                    feature: f.clone(),
                    style: layer.getStyle()
                });
                // alert(layer.get('title'));
            }
            if (!(layer instanceof Group) && layer.get("title") === "Irrigation Canals") {
                let tileGrid = layer.getSource().getTileGrid()
                let f = layer.getSource().getFeaturesInExtent(tileGrid.getExtent());
                if (f.length > 0) {
                    const renderer = new LegendRenderer({
                        maxColumnWidth: 300,
                        maxColumnHeight: 300,
                        overflow: 'auto',
                        styles: [layer.getStyle()],
                        size: [600, 300]
                    });
                    layer.legend['graphic'].render(e.li);


                    f = f[0]
                    let img = Legend.getLegendImage({
                        /* given a style  and a geom type*/
                        style: layer.getStyle(),
                        typeGeom: f.getGeometry().getType()

                        /* or given a feature */
                        // feature: f.clone(),
                        // style: layer.getStyle()
                    });
                    // e.li.appendChild(btn)
                    // e.li.appendChild(img)
                }

            }

            // document.getElementsByClassName('ol-layerswitcher-buttons')[0].append(e.li)
        })


        // Add a button to show/hide the layers
        // var button = $('<div class="toggleVisibility" title="show/hide">')
        //     .text("Show/hide all")
        //     .click(function () {
        //         var a = map.getLayers().getArray();
        //         var b = !a[0].getVisible();
        //         if (b) button.removeClass("show");
        //         else button.addClass("show");
        //         for (var i = 0; i < a.length; i++) {
        //             a[i].setVisible(b);
        //         }
        //     });
        // lswitcher.setHeader($('<div>').append(button).get(0))
        map.addControl(lswitcher);
        this.map.addControl(new FullScreen());
        this.map.addControl(new ScaleLine());
        const mousePosition = new MousePosition({
            coordinateFormat: function (coordinate) {
                // console.log(coordinate);  // displaying coordinate at each change
                return format(coordinate, 'Lat: {y}, Long: {x}', 4);
            },
            projection: 'EPSG:4326',
        });
        this.map.addControl(mousePosition);
    }
}

export default OLControls;