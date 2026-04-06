// import { calculateDistance } from '../utils/helpers';

// export class FareService {
//   private baseFare = 1.5; // ETB
//   private perKmFare = 0.5; // ETB per km
//   private peakHourMultiplier = 1.2;

//   calculateFare(distance: number, isPeakHour: boolean = false): number {
//     let fare = this.baseFare + distance * this.perKmFare;

//     if (isPeakHour) {
//       fare *= this.peakHourMultiplier;
//     }

//     return Math.round(fare * 100) / 100;
//   }

//   calculateFareWithTime(
//     distance: number,
//     estimatedDuration: number,
//     isPeakHour: boolean = false
//   ): number {
//     let baseFare = this.baseFare;
//     let distanceFare = distance * this.perKmFare;
//     let timeFare = (estimatedDuration / 60) * 0.3; // ETB per hour

//     let totalFare = baseFare + distanceFare + timeFare;

//     if (isPeakHour) {
//       totalFare *= this.peakHourMultiplier;
//     }

//     return Math.round(totalFare * 100) / 100;
//   }

//   isPeakHour(): boolean {
//     const hour = new Date().getHours();
//     return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
//   }

//   estimateFare(startLat: number, startLon: number, endLat: number, endLon: number): number {
//     const distance = calculateDistance(startLat, startLon, endLat, endLon);
//     const isPeak = this.isPeakHour();
//     return this.calculateFare(distance, isPeak);
//   }

//   getDiscountedFare(fare: number, discountPercentage: number): number {
//     const discount = (fare * discountPercentage) / 100;
//     return Math.round((fare - discount) * 100) / 100;
//   }
// }

// export default new FareService();
