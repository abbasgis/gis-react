import Button from 'react-bootstrap/Button';
import Config from '../js/Config';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/custom_css.css';
import {Stack} from "react-bootstrap";
import React, {Component} from "react";
import DragPan from 'ol/interaction/DragPan';
import {DragBox} from "ol/interaction";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import {inflateCoordinatesArray} from "ol/geom/flat/inflate";
import ShowToast from "./common/Toast";
import LineString from "ol/geom/LineString";
import SLD2OL from "./common/SLD2OL";


class MapToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {olmap: props.map, lm: props.layerManager, btnClicked: 'default', isToastSHow: false}
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(btnClick) {
        const mtb = this;
        const map = this.state.olmap;
        await this.setState({
            btnClicked: btnClick
        }, function () {
        })
        const view = map.getView()
        switch (btnClick) {
            case "full-extent":
                view.fit(Config.extent_3857, map.getSize());
                break;
            case "zoom-in":
                view.setZoom(view.getZoom() + 1)
                break;
            case "zoom-out":
                view.setZoom(view.getZoom() - 1)
                break;
            case "zoom-rectangle":
                this.setCurserDisplay("crosshair");
                this.removeAllInteraction(map);
                const dragBox = new DragBox({
                    className: 'dragZoom',
                });
                map.addInteraction(dragBox);
                dragBox.on('boxend', function () {
                    let extent = dragBox.getGeometry().getExtent();
                    view.fit(extent, {})
                });
                break;
            case "pan":
                this.setCurserDisplay("grab");
                this.removeAllInteraction(map);
                map.addInteraction(new DragPan());
                break;
            case "identify":
                this.setCurserDisplay("help");
                let k = new SLD2OL()
                let layer_selected = null;
                let layers = this.state.lm.overlayLayers;
                layers.forEach(function (layer) {
                    if (layer.get('name')=== 'irrigation_canals') {
                        layer_selected = layer;
                    }
                });
                k.convertSLD2OL(layer_selected)
                // this.setState((state) => {
                //     return {isToastSHow: true};
                // });
                // this.setState({isToastSHow: true})
                map.on('click', function (evt) {
                    if (mtb.state.btnClicked === "identify") {
                        mtb.displayFeatureInfo(evt.pixel, map);
                    }
                });
                break;
            case "clear":
                this.removeAllInteraction(map);
                this.setCurserDisplay("default");
                let vectorSource = this.state.lm.specialLayers["selectedFeatureLayer"].getSource();
                vectorSource.clear();

                break;
            default:
                break;
        }

    }

    removeAllInteraction(map) {
        const interactionColl = map.getInteractions();
        interactionColl.forEach(function (interaction) {
            if (interaction)
                map.removeInteraction(interaction)
        })
    }

    setCurserDisplay(curserStyle) {
        document.getElementById("map").style.cursor = curserStyle;
    }


    displayFeatureInfo(pixel, map) {
        let lm = this.state.lm;
        const features = [];
        map.forEachFeatureAtPixel(pixel, function (feature) {
            features.push(feature);
        });
        if (features.length > 0) {
            const info = [];
            let i, ii;
            let vectorSource = lm.specialLayers["selectedFeatureLayer"].getSource();
            vectorSource.clear();
            let feature = features[0];
            let gType = feature.getGeometry().getType()
            if (gType === 'Polygon' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const polygonFeature = new Feature(new Polygon(inflatedCoordinates));
                polygonFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([polygonFeature]);
            } else if (gType === 'LineString' && feature.flatCoordinates_) {
                const inflatedCoordinates = inflateCoordinatesArray(
                    feature.getFlatCoordinates(), // flat coordinates
                    0, // offset
                    feature.getEnds(), // geometry end indices
                    2, // stride
                )
                const lineFeature = new Feature(new LineString(inflatedCoordinates[0]));
                lineFeature.setProperties(feature.getProperties())
                vectorSource.addFeatures([lineFeature]);
            }
            let row = '';
            for (let key in feature.getProperties()) {
                row = row + key + ":  " + feature.get(key) + " , "
            }
            alert(row || '&nbsp');
        } else {
            alert('&nbsp;');
        }
    };

    render() {
        return (
            <div>
                <ShowToast isToastSHow={this.state.isToastSHow} title="asd" content="dfg"/>
                <Stack direction="vertical" gap={2}
                       style={{margin: "10px", zIndex: 2, position: "absolute", backgroundColor: "#eee4bb"}}
                       aria-label="Toolbar">
                    <Button variant="outline-light" onClick={() => this.handleClick("full-extent")}><img
                        src={require('../img/icons/ZoomFullExtent.png')}
                        data-toggle="tooltip" title="Zoom to Full Extent" alt="Extent"></img> </Button>{' '}
                    <Button variant="outline-light" onClick={() => this.handleClick("zoom-in")}><img
                        src={require('../img/icons/icon_zoomin.gif')}
                        data-toggle="tooltip" title="Zoom In"></img> </Button>{' '}
                    <Button variant="outline-light" onClick={() => this.handleClick("zoom-out")}><img
                        src={require('../img/icons/icon_zoomout.gif')}
                        data-toggle="tooltip" title="Zoom Out"></img> </Button>{' '}
                    <Button variant="outline-light" onClick={() => this.handleClick("zoom-rectangle")}><img
                        src={require('../img/icons/icon_zoomrect.gif')}
                        data-toggle="tooltip" title="Zoom by Rectangle"></img> </Button>{' '}
                    <Button variant="outline-light" onClick={() => this.handleClick("pan")}><img
                        src={require('../img/icons/icon_pan.gif')}
                        data-toggle="tooltip" title="Zoom In"></img> </Button>{' '}
                    <Button variant="outline-light" onClick={() => this.handleClick("identify")}><img
                        src={require('../img/icons/icon_information.png')}
                        data-toggle="tooltip" title="Identify"></img> </Button>{' '}
                    <Button variant="outline-light" onClick={() => this.handleClick("clear")}><img
                        src={require('../img/icons/yes.png')}
                        data-toggle="tooltip" title="Clear All"></img> </Button>{' '}
                </Stack>
            </div>
        );

    }


}

export default MapToolBar;