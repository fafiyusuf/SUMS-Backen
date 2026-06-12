import crypto from 'crypto';

import { sequelize } from '../../config/database';
import '../../modules/models';

import {
  Bus,
  GPSCoordinate,
  Incident,
  Route,
  Schedule,
  SmartCard,
  Stop,
  Transaction,
  Trip,
  User,
  Wallet
} from '../../modules/models';

const PASSWORD_HASH_ADMIN123 =
  '$2a$10$O6SBy9iqV33wo4AM8D9ZR.L7hDE/.l9WwIybKUT/XESNoPN6Re3Oi'; // equals 'admin123'

function stableUuid(name: string): string {
  const hash = crypto.createHash('sha256').update(`sums-adama:${name}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));

  // RFC4122 variant + v4 (deterministic bytes, but marked v4)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function stableInt(name: string, maxExclusive: number): number {
  const hash = crypto.createHash('sha256').update(`sums-adama:int:${name}`).digest();
  const n = hash.readUInt32BE(0);
  return n % maxExclusive;
}

function phoneFor(name: string): string {
  // Ethiopian mobile format: +2519XXXXXXXX
  const last8 = String(10_000_000 + stableInt(name, 90_000_000)).slice(1);
  return `+2519${last8}`;
}

function timeHHMM(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

type LatLng = { lat: number; lng: number };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function jitter(name: string, scale: number): number {
  const v = stableInt(name, 10_000) / 10_000;
  return (v - 0.5) * 2 * scale;
}

async function truncateAll(): Promise<void> {
  // Note: order is irrelevant with CASCADE, but keeping it explicit helps readability.
  await sequelize.query(
    [
      'TRUNCATE TABLE',
      '  "gps_coordinates",',
      '  "incidents",',
      '  "trips",',
      '  "schedules",',
      '  "buses",',
      '  "stops",',
      '  "routes",',
      '  "transactions",',
      '  "smart_cards",',
      '  "wallets",',
      '  "users"',
      'RESTART IDENTITY CASCADE;'
    ].join('\n')
  );
}

async function seedAdama(): Promise<void> {
  await sequelize.authenticate();

  // Ensure all model-backed tables exist (the project uses sync+alter in development).
  // await sequelize.sync({ alter: true });

  await truncateAll();

  // --- Users ---
  const adminId = stableUuid('user:admin');
  const driverIds = Array.from({ length: 5 }, (_, i) => stableUuid(`user:driver:${i + 1}`));
  const passengerIds = Array.from({ length: 25 }, (_, i) => stableUuid(`user:passenger:${i + 1}`));

  const drivers = [
    { fullName: 'Tadesse Bekele', email: 'tadesse.bekele@adama.sums.local' },
    { fullName: 'Hana Tesfaye', email: 'hana.tesfaye@adama.sums.local' },
    { fullName: 'Abel Kebede', email: 'abel.kebede@adama.sums.local' },
    { fullName: 'Mekdes Girma', email: 'mekdes.girma@adama.sums.local' },
    { fullName: 'Solomon Getachew', email: 'solomon.getachew@adama.sums.local' }
  ];

  const passengers = [
    'Saron Alemu',
    'Yonatan Mekonnen',
    'Selamawit Worku',
    'Dawit Assefa',
    'Rahel Abate',
    'Eyob Haile',
    'Marta Teshome',
    'Bereket Tesema',
    'Lily Ayele',
    'Kidus Desta',
    'Haben Hagos',
    'Tigist Nega',
    'Samuel Mulu',
    'Feven Tsegaye',
    'Natnael Wolde',
    'Lensa Daba',
    'Ruth Shewangizaw',
    'Amanuel Teshome',
    'Hawi Tesfahun',
    'Mulugeta Fikre',
    'Meron Asrat',
    'Yonas Berhanu',
    'Eden Kassa',
    'Fitsum Abebe',
    'Beza Alemayehu'
  ].map((fullName, idx) => ({
    fullName,
    email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@adama.sums.local`,
    idx
  }));

  await User.bulkCreate(
    [
      {
        id: adminId,
        fullName: 'Adama Admin',
        email: 'admin@adama.sums.local',
        phone: phoneFor('admin'),
        password: PASSWORD_HASH_ADMIN123,
        role: 'admin',
        status: 'active'
      },
      ...drivers.map((d, i) => ({
        id: driverIds[i],
        fullName: d.fullName,
        email: d.email,
        phone: phoneFor(`driver:${d.email}`),
        password: PASSWORD_HASH_ADMIN123,
        role: 'driver' as const,
        status: 'active' as const
      })),
      ...passengers.map((p, i) => ({
        id: passengerIds[i],
        fullName: p.fullName,
        email: p.email,
        phone: phoneFor(`passenger:${p.email}`),
        password: PASSWORD_HASH_ADMIN123,
        role: 'passenger' as const,
        status: 'active' as const
      }))
    ],
    { validate: true }
  );

  // --- Wallets ---
  await Wallet.bulkCreate(
    [...driverIds, ...passengerIds].map((userId) => ({
      id: stableUuid(`wallet:${userId}`),
      userId,
      balance: 0,
      currency: 'ETB'
    })),
    { validate: true }
  );

  // --- Routes (Adama) ---
  const routeDefs = [
    {
      id: stableUuid('route:bus-terminal-astu'),
      name: 'Adama Bus Terminal → ASTU',
      startPoint: 'Adama Bus Terminal',
      endPoint: 'ASTU Main Gate',
      distance: 12.4,
      estimatedDuration: 35
    },
    {
      id: stableUuid('route:posta-medhanialem'),
      name: 'Posta → Medhanialem',
      startPoint: 'Posta',
      endPoint: 'Medhanialem',
      distance: 6.8,
      estimatedDuration: 22
    },
    {
      id: stableUuid('route:old-bus-station-kebele04'),
      name: 'Old Bus Station → Kebele 04',
      startPoint: 'Old Bus Station',
      endPoint: 'Kebele 04',
      distance: 8.1,
      estimatedDuration: 26
    }
  ];

  await Route.bulkCreate(routeDefs.map((r) => ({ ...r, status: 'active' })), { validate: true });

  // --- Stops (with rough Adama coordinates) ---
  const baseAdama: LatLng = { lat: 8.5400, lng: 39.2700 };

  const stopDefs: Array<{ id: string; routeId: string; name: string; sequenceNumber: number; latLng: LatLng }> = [];

  function addRouteStops(routeId: string, stopNames: string[], start: LatLng, end: LatLng): void {
    stopNames.forEach((name, idx) => {
      const t = stopNames.length === 1 ? 0 : idx / (stopNames.length - 1);
      const lat = lerp(start.lat, end.lat, t) + jitter(`stop:${routeId}:${name}:lat`, 0.0015);
      const lng = lerp(start.lng, end.lng, t) + jitter(`stop:${routeId}:${name}:lng`, 0.0015);
      stopDefs.push({
        id: stableUuid(`stop:${routeId}:${idx + 1}`),
        routeId,
        name,
        sequenceNumber: idx + 1,
        latLng: { lat, lng }
      });
    });
  }

  addRouteStops(
    routeDefs[0].id,
    ['Adama Bus Terminal', 'Posta', 'St. Mary', 'Adama Market', 'ASTU Junction', 'ASTU Main Gate'],
    { lat: baseAdama.lat + 0.008, lng: baseAdama.lng - 0.010 },
    { lat: baseAdama.lat - 0.030, lng: baseAdama.lng + 0.060 }
  );

  addRouteStops(
    routeDefs[1].id,
    ['Posta', 'Taxi Station', 'Adama Stadium', 'Tikur Abay', 'Medhanialem'],
    { lat: baseAdama.lat + 0.002, lng: baseAdama.lng - 0.004 },
    { lat: baseAdama.lat + 0.012, lng: baseAdama.lng + 0.020 }
  );

  addRouteStops(
    routeDefs[2].id,
    ['Old Bus Station', 'Shewa Dabo', 'Adama Hospital', 'Kebele 02', 'Kebele 04'],
    { lat: baseAdama.lat + 0.010, lng: baseAdama.lng - 0.015 },
    { lat: baseAdama.lat - 0.006, lng: baseAdama.lng + 0.030 }
  );

  await Stop.bulkCreate(
    stopDefs.map((s) => ({
      id: s.id,
      routeId: s.routeId,
      name: s.name,
      latitude: s.latLng.lat,
      longitude: s.latLng.lng,
      sequenceNumber: s.sequenceNumber
    })),
    { validate: true }
  );

  // --- Buses ---
  const busDefs = [
    { reg: 'OR-3-12045', routeId: routeDefs[0].id, driverId: driverIds[0], capacity: 60 },
    { reg: 'OR-3-28410', routeId: routeDefs[0].id, driverId: driverIds[1], capacity: 45 },
    { reg: 'OR-3-55109', routeId: routeDefs[1].id, driverId: driverIds[2], capacity: 50 },
    { reg: 'OR-3-39877', routeId: routeDefs[2].id, driverId: driverIds[3], capacity: 55 },
    { reg: 'OR-3-77302', routeId: routeDefs[2].id, driverId: driverIds[4], capacity: 40 }
  ];

  const buses = await Bus.bulkCreate(
    busDefs.map((b) => ({
      id: stableUuid(`bus:${b.reg}`),
      registrationNumber: b.reg,
      driverId: b.driverId,
      routeId: b.routeId,
      capacity: b.capacity,
      currentPassengers: 0,
      status: 'inactive' as const
    })),
    { validate: true, returning: true }
  );

  // --- Schedules (weekday-heavy + weekend reduced) ---
  const scheduleRows: Array<{
    id: string;
    routeId: string;
    busId: string;
    dayOfWeek: number;
    departureTime: string;
    arrivalTime: string;
    isActive: boolean;
  }> = [];

  const weekdayDepartures = [
    { dep: timeHHMM(6, 0), arr: timeHHMM(6, 45) },
    { dep: timeHHMM(7, 30), arr: timeHHMM(8, 15) },
    { dep: timeHHMM(12, 0), arr: timeHHMM(12, 45) },
    { dep: timeHHMM(17, 30), arr: timeHHMM(18, 15) }
  ];

  const weekendDepartures = [
    { dep: timeHHMM(8, 0), arr: timeHHMM(8, 45) },
    { dep: timeHHMM(16, 0), arr: timeHHMM(16, 45) }
  ];

  routeDefs.forEach((route) => {
    const busForRoute = buses.find((b) => b.routeId === route.id) ?? buses[0];

    for (let day = 0; day < 7; day += 1) {
      const blocks = day === 0 || day === 6 ? weekendDepartures : weekdayDepartures;
      blocks.forEach((block, idx) => {
        scheduleRows.push({
          id: stableUuid(`schedule:${route.id}:${day}:${idx}`),
          routeId: route.id,
          busId: busForRoute.id,
          dayOfWeek: day,
          departureTime: block.dep,
          arrivalTime: block.arr,
          isActive: true
        });
      });
    }
  });

  await Schedule.bulkCreate(scheduleRows, { validate: true });

  // --- Smart cards ---
  await SmartCard.bulkCreate(
    passengerIds.map((userId, idx) => ({
      id: stableUuid(`card:${userId}`),
      cardId: `ADAMA-RFID-${String(idx + 1).padStart(6, '0')}`,
      userId,
      status: 'ACTIVE' as const,
      telebirrPhone: idx % 3 === 0 ? phoneFor(`telebirr:${userId}`) : null,
      activatedAt: new Date(Date.now() - (idx + 1) * 24 * 60 * 60 * 1000),
      lastUsedAt: idx % 2 === 0 ? new Date(Date.now() - (idx + 1) * 60 * 60 * 1000) : undefined
    })),
    { validate: true }
  );

  // --- Transactions (top-ups + trip fares) + Trips ---
  const now = Date.now();
  const tripsToCreate: Array<{
    id: string;
    userId: string | null;
    busId: string;
    routeId: string;
    startStopId: string;
    endStopId: string | null;
    startTime: Date;
    endTime?: Date;
    fare: number;
    status: 'ongoing' | 'completed' | 'cancelled';
  }> = [];

  const txToCreate: Array<{
    id: string;
    userId: string;
    type: 'debit' | 'credit';
    amount: number;
    description: string;
    reference?: string;
    outTradeNo?: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt?: Date;
    updatedAt?: Date;
  }> = [];

  // Top-up each passenger wallet (credit)
  passengerIds.forEach((userId, idx) => {
    const amount = 150 + stableInt(`topup:${userId}`, 500); // 150..649
    const when = new Date(now - (10 + idx) * 60 * 60 * 1000);
    txToCreate.push({
      id: stableUuid(`tx:topup:${userId}`),
      userId,
      type: 'credit',
      amount,
      description: 'Telebirr top-up',
      reference: `TOPUP-${String(idx + 1).padStart(5, '0')}`,
      outTradeNo: `OUT-${String(idx + 1).padStart(8, '0')}`,
      status: 'completed',
      createdAt: when,
      updatedAt: when
    });
  });

  // Create trips over the last 7 days
  const routesWithStops = routeDefs.map((route) => {
    const stops = stopDefs.filter((s) => s.routeId === route.id).sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    const routeBuses = buses.filter((b) => b.routeId === route.id);
    return { route, stops, routeBuses };
  });

  passengerIds.forEach((userId, idx) => {
    const routePick = routesWithStops[idx % routesWithStops.length];
    const busPick = routePick.routeBuses[idx % routePick.routeBuses.length] ?? buses[0];

    const tripCount = idx % 5 === 0 ? 2 : 1;
    for (let j = 0; j < tripCount; j += 1) {
      const startIndex = stableInt(`trip:${userId}:${j}:start`, Math.max(1, routePick.stops.length - 1));
      const endIndex = Math.min(routePick.stops.length - 1, startIndex + 1 + stableInt(`trip:${userId}:${j}:delta`, 3));

      const startStop = routePick.stops[startIndex];
      const endStop = routePick.stops[endIndex];

      const fare = 10 + stableInt(`fare:${userId}:${j}`, 25); // 10..34 ETB

      const startTime = new Date(now - (idx * 2 + j) * 60 * 60 * 1000);
      const durationMinutes = 12 + stableInt(`tripdur:${userId}:${j}`, 35);
      const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

      const tripId = stableUuid(`trip:${userId}:${j}`);
      tripsToCreate.push({
        id: tripId,
        userId,
        busId: busPick.id,
        routeId: routePick.route.id,
        startStopId: startStop.id,
        endStopId: endStop.id,
        startTime,
        endTime,
        fare,
        status: 'completed'
      });

      txToCreate.push({
        id: stableUuid(`tx:fare:${tripId}`),
        userId,
        type: 'debit',
        amount: fare,
        description: `Trip fare: ${routePick.route.name}`,
        reference: `FARE-${tripId.slice(0, 8).toUpperCase()}`,
        status: 'completed',
        createdAt: endTime,
        updatedAt: endTime
      });
    }
  });

  // Add a couple of ongoing trips
  for (let k = 0; k < 3; k += 1) {
    const userId = passengerIds[k];
    const routePick = routesWithStops[k % routesWithStops.length];
    const busPick = routePick.routeBuses[0] ?? buses[0];

    const startStop = routePick.stops[0];
    const endStop = routePick.stops[Math.min(routePick.stops.length - 1, 2)];

    const startTime = new Date(now - (30 + k * 10) * 60 * 1000);
    const fare = 18 + k * 2;

    tripsToCreate.push({
      id: stableUuid(`trip:ongoing:${k}`),
      userId,
      busId: busPick.id,
      routeId: routePick.route.id,
      startStopId: startStop.id,
      endStopId: endStop.id,
      startTime,
      fare,
      status: 'ongoing'
    });
  }

  // Add driver session trips (userId is null) for history testing
  buses.forEach((bus, bIdx) => {
    if (!bus.routeId) return;
    const routePick = routesWithStops.find((r) => r.route.id === bus.routeId) || routesWithStops[0];
    const startStop = routePick.stops[0];
    const endStop = routePick.stops[routePick.stops.length - 1];

    for (let j = 0; j < 3; j += 1) {
      const startTime = new Date(now - (7 - j) * 24 * 60 * 60 * 1000 - bIdx * 2 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + (45 + bIdx * 5) * 60 * 1000);

      tripsToCreate.push({
        id: stableUuid(`trip:driver-session:${bus.id}:${j}`),
        userId: null,
        busId: bus.id,
        routeId: bus.routeId,
        startStopId: startStop.id,
        endStopId: endStop.id,
        startTime,
        endTime,
        fare: 0,
        status: 'completed'
      });
    }
  });

  await Trip.bulkCreate(tripsToCreate, { validate: true });
  await Transaction.bulkCreate(txToCreate, { validate: true });

  // Recompute wallet balances from transactions (ledger-consistent)
  const txByUser = new Map<string, { credit: number; debit: number }>();
  txToCreate.forEach((tx) => {
    const agg = txByUser.get(tx.userId) ?? { credit: 0, debit: 0 };
    if (tx.type === 'credit') {
      agg.credit += tx.amount;
    } else {
      agg.debit += tx.amount;
    }
    txByUser.set(tx.userId, agg);
  });

  await Promise.all(
    [...txByUser.entries()].map(async ([userId, agg]) => {
      const balance = Math.max(0, Number((agg.credit - agg.debit).toFixed(2)));
      await Wallet.update({ balance }, { where: { userId } });
    })
  );

  // --- GPS coordinates (recent) ---
  const gpsRows: Array<{
    id: string;
    busId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    speed: number;
    heading: number;
    timestamp: Date;
  }> = [];

  buses.forEach((bus) => {
    const routeStops = stopDefs
      .filter((s) => s.routeId === bus.routeId)
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    const start = routeStops[0]?.latLng ?? baseAdama;
    const end = routeStops[routeStops.length - 1]?.latLng ?? baseAdama;

    for (let i = 0; i < 12; i += 1) {
      const t = i / 11;
      gpsRows.push({
        id: stableUuid(`gps:${bus.id}:${i}`),
        busId: bus.id,
        latitude: lerp(start.lat, end.lat, t) + jitter(`gps:${bus.id}:${i}:lat`, 0.0008),
        longitude: lerp(start.lng, end.lng, t) + jitter(`gps:${bus.id}:${i}:lng`, 0.0008),
        accuracy: 5 + stableInt(`gpsacc:${bus.id}:${i}`, 15),
        speed: 10 + stableInt(`gpsspd:${bus.id}:${i}`, 35),
        heading: stableInt(`gpshdg:${bus.id}:${i}`, 360),
        timestamp: new Date(now - (55 - i * 5) * 60 * 1000)
      });
    }
  });

  await GPSCoordinate.bulkCreate(gpsRows, { validate: true });

  // --- Incidents ---
  const incidents = [
    {
      id: stableUuid('incident:1'),
      busId: buses[0].id,
      type: 'Mechanical',
      severity: 'medium' as const,
      description: 'Brake noise reported during morning route.',
      reportedBy: buses[0].driverId,
      status: 'acknowledged' as const
    },
    {
      id: stableUuid('incident:2'),
      busId: buses[3].id,
      type: 'Traffic',
      severity: 'low' as const,
      description: 'Minor delay due to congestion near Posta.',
      reportedBy: buses[3].driverId,
      status: 'resolved' as const
    },
    {
      id: stableUuid('incident:3'),
      busId: buses[2].id,
      type: 'Passenger',
      severity: 'high' as const,
      description: 'Passenger conflict reported; assistance requested.',
      reportedBy: buses[2].driverId,
      status: 'open' as const
    }
  ];

  await Incident.bulkCreate(incidents, { validate: true });

  const counts = await Promise.all([
    User.count(),
    Wallet.count(),
    SmartCard.count(),
    Route.count(),
    Stop.count(),
    Bus.count(),
    Schedule.count(),
    Trip.count(),
    Transaction.count(),
    GPSCoordinate.count(),
    Incident.count()
  ]);

  // eslint-disable-next-line no-console
  console.log(
    [
      'Seeded Adama dataset:',
      `users=${counts[0]}`,
      `wallets=${counts[1]}`,
      `smart_cards=${counts[2]}`,
      `routes=${counts[3]}`,
      `stops=${counts[4]}`,
      `buses=${counts[5]}`,
      `schedules=${counts[6]}`,
      `trips=${counts[7]}`,
      `transactions=${counts[8]}`,
      `gps_coordinates=${counts[9]}`,
      `incidents=${counts[10]}`
    ].join(' ')
  );
}

seedAdama()
  .then(async () => {
    await sequelize.close();
    process.exit(0);
  })
  .catch(async (err: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Adama seed failed:', err);
    try {
      await sequelize.close();
    } finally {
      process.exit(1);
    }
  });
