import OlParser from 'geostyler-openlayers-parser';
import SldParser from 'geostyler-sld-parser';
import LegendRenderer from "geostyler-legend/dist/LegendRenderer/LegendRenderer";

class SLD2OL {
    convertSLD2OL(layer) {
        const olParser = new OlParser();
        const sldParser = new SldParser();
        const url = "data/sld/irrigation_network_lbdc.sld";
        // const url = "http://localhost:3338/layers/get_sld_from_server/1";
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.text();
                }
            })
            .then(async (text) => {
                text = text.replaceAll("SvgParameter", "CssParameter");
                sldParser.readStyle(text)
                    .then((geostylerStyle) => {
                        const renderer = new LegendRenderer({
                            maxColumnWidth: 300,
                            maxColumnHeight: 300,
                            overflow: 'auto',
                            styles: [geostylerStyle.output],
                            size: [200, 300] //w,h
                        });
                        layer.legend = {sType: 'sld', graphic: renderer}
                        // console.log(JSON.stringify(geostylerStyle.output));
                        return olParser.writeStyle(geostylerStyle.output);
                    })
                    .then((olStyle) => {
                        // Run your actions with the converted style here
                        // console.log(olStyle.output);
                        layer.setStyle(olStyle.output)
                        layer.getSource().refresh()

                    });
            });
    }
}

export default SLD2OL;