import { sequelize } from '../config/database';

// Import models to ensure associations are loaded
import '../modules/models';

// Define associations - all associations are now defined in models/index.ts
// This function ensures models are imported and associations are set up
export function initializeAssociations(): void {
  // Associations are automatically set up when models/index.ts is imported
  // This function is kept for backwards compatibility
}

export default sequelize;
