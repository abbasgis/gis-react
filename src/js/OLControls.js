import LayerSwitcher from "ol-layerswitcher";
import MousePosition from "ol/control/MousePosition";
import {format} from 'ol/coordinate';
import { FullScreen, ScaleLine} from "ol/control";

class OLControls {
    map = null;

    constructor(map) {
        this.map = map;
        this.map.addControl(new FullScreen());
        this.map.addControl(new ScaleLine());
        const layerSwitcher = new LayerSwitcher({
            tipLabel: 'Légende', // Optional label for button
            groupSelectStyle: 'children'
        });
        const mousePosition = new MousePosition({
            coordinateFormat: function (coordinate) {
                // console.log(coordinate);  // displaying coordinate at each change
                return format(coordinate, 'Lat: {y}, Long: {x}', 4);
            },
            projection: 'EPSG:4326',
        });
        this.map.addControl(layerSwitcher);
        this.map.addControl(mousePosition);
    }
}

export default OLControls;