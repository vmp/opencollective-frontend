import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from './ExternalLink';
import { FormattedMessage } from 'react-intl';

class Map extends React.Component {
  static propTypes = {
    lat: PropTypes.number,
    long: PropTypes.number,
    address: PropTypes.string,
  };

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: false,
    });
  }

  calcLong(long, zoom) {
    return (long / Math.pow(2, zoom)) * 360 - 180;
  }

  calcLat(lat, zoom) {
    const n = Math.PI - (2 * Math.PI * lat) / Math.pow(2, zoom);
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  }

  makeBbox(long, lat, zoom) {
    const bbox = []; // south, north ,west, east

    bbox[0] = this.calcLat(lat + 1, zoom); // sount
    bbox[1] = this.calcLat(lat, zoom); // north
    bbox[2] = this.calcLong(long, zoom); // west
    bbox[2] = this.calcLong(long + 1, zoom); // east

    return bbox;
  }

  render() {
    const { lat, long } = this.props;
    const zoom = 15;
    const bbox = this.makeBbox(long, lat, zoom);

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <iframe
          width={'100%'}
          height={'100%'}
          frameBorder="0"
          scrolling="no"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat}%2C${long}&layers=ND`}
        ></iframe>
        <br />

        <ExternalLink
          openInNewTab
          href={`https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${long}#map=16/${lat}/${long}`}
        >
          <FormattedMessage id="map.viewLarger" defaultMessage="View Larger Map" />
        </ExternalLink>
      </div>
    );
  }
}

export default Map;
