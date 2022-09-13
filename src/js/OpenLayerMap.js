import React, {Component} from "react";
import "ol/ol.css";
import "ol-layerswitcher/src/ol-layerswitcher.css";
import OlMap from "ol/Map";
import OlView from "ol/View";
import MapToolBar from "./MapToolBar";
import Config from "./Config";
import {getCenter} from "ol/extent";
import LayersManager from "./Layers";
import OLControls from "./OLControls";
import LayerGroup from "ol/layer/Group";
import ShowToast from "./common/Toast";

class OpenLayerMap extends Component {
    constructor(props) {
        super(props);
        this.lm = new LayersManager();
        this.state = {center: getCenter(Config.extent_3857), zoom: 7, isToastSHow: false};
        this.toggleToast = this.toggleToast.bind(this)
        /*
        let vtLayer = new VectorTileLayer({
            declutter: true,
            source: new VectorTileSource({
                maxZoom: 15,
                format: new MVT({
                    idProperty: "iso_a3"
                }),
                tileUrlFunction: function (tileCoord) {
                    const z = String(tileCoord[0] * 2 - 1);
                    const x = String(tileCoord[1]);
                    const y = String(tileCoord[2]);
                    var tileURL = "http://localhost:3338/layers/mvt_layer/12/" + z + "/" + x + "/" + y;
                    return tileURL;
                },
                tileLoadFunction: function (tile, url) {
                    tile.setLoader(async (extent, resolution, projection) => {
                        fetch(url).then((response) => {
                            response.arrayBuffer().then((data) => {
                                const format = tile.getFormat(); // ol/format/MVT configured as source format
                                const features = format.readFeatures(data, {
                                    extent: extent,
                                    featureProjection: projection
                                });
                                tile.setFeatures(features);
                            });
                        });
                    });
                }
                // tileUrlFunction: (tileCoord) => {
                //     const z = tileCoord[0];
                //     const x = tileCoord[1];
                //     const y = Math.pow(2, z) - tileCoord[2] - 1;
                //     return (
                //         "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/" +
                //         `ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/${z}/${x}/${y}.pbf`
                //     );
                // }
            }),
            // style: country
        });
        */
        this.olmap = new OlMap({
            target: null,
            layers: [
                this.lm.getBaseLayersGroup(),
                new LayerGroup({
                    name: 'Overlay Layers',
                    title: 'Overlay Layers',
                    layers: this.lm.getOverlayLayers()
                })
            ],
            view: new OlView({
                center: this.state.center,
                // center: this.state.center,
                zoom: this.state.zoom,
                projection: 'EPSG:3857',
            }),
            controls: [],
        });
        // add controls to map
        new OLControls(this.olmap)

    }

    toggleToast() {
        this.setState({isToastSHow: true})
    }

    updateMap() {
        this.olmap.getView().setCenter(this.state.center);
        this.olmap.getView().setZoom(this.state.zoom);
    }


    componentDidMount() {
        this.olmap.setTarget("map");
    }

    render() {
        // this.updateMap(); // Update map on render?
        return (
            <div>
                <ShowToast isToastSHow={this.state.isToastSHow} title="asd" content="dfg"/>
                <MapToolBar toggleToast={this.toggleToast} map={this.olmap} layerManager={this.lm}/>
                <div id="map" style={{width: "100%", height: "90%", position: "fixed"}}></div>
            </div>
        );
    }
}

export default OpenLayerMap;
