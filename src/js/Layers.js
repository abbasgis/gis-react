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

class LayersManager {
    overlayLayers = []
    baseLayers = []
    specialLayers = []

    constructor() {
        this.addBaseLayer();
        this.addOverlayLayers();
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

    getBaseLayersGroup() {
        return this.baseLayers;
    }

    addOverlayLayers() {
        let mvtLayerDivisions = new VectorTileLayer({
            title: "Irrigation Divisions",
            type: "base2",
            source: new VectorTileSource({
                format: new MVT(),
                url: "http://localhost:3338/layers/mvt_layer/12/{z}/{x}/{y}"
            }),
            style: function (feature, res) {
                return new Style({
                    stroke: new Stroke({
                        width: 2,
                        color: 'rgb(10,12,94)'
                    })
                })
            }
        })
        this.overlayLayers.push(mvtLayerDivisions)
        let mvtLayerCanals = new VectorTileLayer({
            title: "Irrigation Canals",
            type: "base2",
            source: new VectorTileSource({
                format: new MVT(),
                url: "http://localhost:3338/layers/mvt_layer/1/{z}/{x}/{y}"
            }),
            style: function (feature, res) {
                return new Style({
                    stroke: new Stroke({
                        width: 2,
                        color: 'rgba(0, 102, 204)'
                    })
                })
            }
        });
        this.overlayLayers.push(mvtLayerCanals)
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
