import { Bus } from './src/modules/bus/bus.model';
import { GPSCoordinate } from './src/modules/gps/gps.model';
import './src/modules/models'; // to initialize associations

async function test() {
  try {
    const res = await Bus.findAndCountAll({
      limit: 100,
      offset: 0,
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: GPSCoordinate,
          as: 'gpsCoordinates',
          limit: 1,
          order: [['timestamp', 'DESC']]
        }
      ]
    });
    console.log("Success!", res.rows.length);
    process.exit(0);
  } catch(e) {
    console.error("DB Error:", e);
    process.exit(1);
  }
}
test();
