import LayerGroup from 'ol/layer/Group';
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import {Stroke, Style} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Text from 'ol/style/Text';
import Config from "./Config";
import SLD2OL from "./common/SLD2OL";
import Legend from "ol-ext/legend/Legend";

class LayersManager {
    overlayLayers = []
    baseLayers = []
    specialLayers = []
    layers = [
        {
            'title': 'Irrigation Divisions',
            'name': 'irrigation_divisions',
            'displayInSwitcher': true,
            'lType': 'mvt',
            'url': "http://localhost:3338/layers/mvt_layer/2/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'ol', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
        {
            'title': 'Irrigation Canals',
            'name': 'irrigation_canals',
            'displayInSwitcher': true,
            'lType': 'mvt',
            'url': "http://localhost:3338/layers/mvt_layer/1/{z}/{x}/{y}",
            'isVisible': true,
            'legend': {sType: 'sld', graphic: null}, // stype is Style Type can be "ol" or "sld"
        },
    ]

    constructor() {
        this.addBaseLayer();
        this.addOverlayLayers();
        this.updateLayersStyle(this.overlayLayers);
        this.addSelectedFeatureLayer();
    }

    addBaseLayer() {
        if (this.baseLayers.length === 0) {
            this.baseLayers = new LayerGroup({
                name: 'Base Layers',
                info: false,
                title: 'Base Layers',
                fold: 'open',
                openInLayerSwitcher: true,
                layers: [
                    new OlLayerTile({
                        name: "Satellite",
                        title: "Google Satellite",
                        type: "base",
                        visible: false,
                        source: new OlSourceOSM({
                            url: "http://mt{0-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                        })
                    }),
                    new OlLayerTile({
                        name: 'Road Map',
                        title: "Google Roads",
                        type: "base",
                        visible: true,
                        displayInLayerSwitcher: true,
                        source: new OlSourceOSM({
                            url: "http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",

                        })
                    }),
                    new OlLayerTile({
                        type: "base",
                        title: "OSM",
                        visible: false,
                        source: new OlSourceOSM()
                    }),
                ]
            });
        }
    };

    addOverlayLayers() {
        let me = this;
        this.layers.forEach(function (layer) {
            // const layer = this.layers[index];
            let mvt_layer = new VectorTileLayer({
                title: layer.title,
                name: layer.name,
                visible: layer.isVisible,
                displayInSwitcher: layer.displayInSwitcher,
                legend: layer.legend,
                source: new VectorTileSource({
                    format: new MVT(),
                    url: layer.url
                }),
                style: function (feature, res) {
                    return me.getVectorLayerStyle(feature, layer)
                }
            });
            me.overlayLayers.push(mvt_layer)
        })
    }

    getLegendGraphic = function (layer) {
        let tileGrid = layer.getSource().getTileGrid()
        let feature = layer.getSource().getFeaturesInExtent(tileGrid.getExtent());
        let img = Legend.getLegendImage({
            /* given a style  and a geom type*/
            style: layer.getStyle(),
            typeGeom: feature.getGeometry().getType()

        });
        return img;
    }
    updateLayersStyle = function (arrLayers) {
        let k = new SLD2OL()
        const me=this;
        arrLayers.forEach(function (layer) {
            if (layer.get('legend')['sType'] === 'sld') {
                k.convertSLD2OL(layer)
            }else if(layer.get('legend')['sType'] === 'ol'){
                layer.legend = {sType: 'ol', graphic: null}
            }
        });
    }

    getVectorLayerStyle(feature, layer) {
        if (layer.legend['sType'] === 'ol') {
            let style = null;
            switch (layer['name']) {
                case "irrigation_canals":
                    style = new Style({
                        stroke: new Stroke({
                            width: 2,
                            color: 'rgba(0, 102, 204)'
                        })
                    })
                    break;
                case "irrigation_divisions":
                    style = new Style({
                        stroke: new Stroke({
                            width: 2,
                            color: 'rgb(10,12,94)'
                        })
                    })
                    break;
                default:
                    break
            }
            return style;
        }

    }

    getBaseLayersGroup() {
        return this.baseLayers;
    }

    getOverlayLayers() {
        return this.overlayLayers;
    }

    addSelectedFeatureLayer() {
        let me = this;
        this.specialLayers["selectedFeatureLayer"] = new VectorLayer({
            name: "selected features",
            title: "Selection Layer",
            info: false,
            // visible:false,
            hideInLegend: true,
            displayInLayerSwitcher: false,
            source: new VectorSource({
                features: []
            }),
            style: function (feature) {
                return me.getSelectStyle(feature)
            }
        });
        this.specialLayers["selectedFeatureLayer"].setZIndex(999)
        this.overlayLayers.push(this.specialLayers['selectedFeatureLayer']);
    }

    getSelectStyle(feature) {
        let g_type = feature.getGeometry().getType();
        let selStyle = null;
        if (!g_type) g_type = feature.f;
        if (g_type.indexOf('Point') !== -1) {
            selStyle = new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({color: 'rgba(0, 0, 0, 0.33)'}),
                    stroke: new Stroke({
                        color: [0, 0, 0], width: 1.5
                    })
                })
                // image: new ol.style.Icon({
                //     anchor: [0.5, 0.5],
                //     opacity: 1,
                //     src: '/static/assets/img/icons/flashing_circle.gif'
                // })
            });
        } else if (g_type.indexOf('LineString') !== -1) {
            selStyle = new Style({
                stroke: new Stroke({
                    color: '#d17114',
                    width: 5
                }),
                text: new Text({
                    text: feature.get('measurement'),
                    stroke: new Stroke({color: "#fff", width: 2}),
                    fill: new Fill({color: 'black'}),
                    font: 'bold' + ' ' + '15' + 'px ' + 'Arial, Helvetica, Helvetica, sans-serif',
                })
            });
        } else {
            selStyle = new Style({
                fill: new Fill({
                    color: 'rgba(209, 113, 20, 0)'
                }),
                stroke: new Stroke({
                    color: '#d17114',
                    width: 3
                }),
                text: new Text({
                    text: feature.get('measurement'),
                    stroke: new Stroke({color: "#fff", width: 2}),
                    fill: new Fill({color: 'black'}),
                    overflow: true,
                    font: 'bold' + ' ' + '15' + 'px ' + 'Arial, Helvetica, Helvetica, sans-serif',
                })
            });
        }
        return selStyle;
    }
}

export default LayersManager;
