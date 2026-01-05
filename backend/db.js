import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'data', '1view.sqlite'),
    logging: false // Toggle to true to see SQL queries
});

// Define Models

const Retailer = sequelize.define('Retailer', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true // Auto-approve for demo
    },
    verificationToken: {
        type: DataTypes.STRING
    }
});

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    phone: {
        type: DataTypes.STRING
    },
    hours: {
        type: DataTypes.STRING
    },
    ownerId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verificationStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'approved' // Auto-approve for demo
    }
});

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    offers: {
        type: DataTypes.STRING
    },
    storeId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Search = sequelize.define('Search', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    query: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat: {
        type: DataTypes.FLOAT
    },
    lng: {
        type: DataTypes.FLOAT
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    storeId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    billId: {
        type: DataTypes.STRING
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Relationships
Retailer.hasOne(Store, { foreignKey: 'ownerId' });
Store.belongsTo(Retailer, { foreignKey: 'ownerId' });

Store.hasMany(Product, { foreignKey: 'storeId' });
Product.belongsTo(Store, { foreignKey: 'storeId' });

Store.hasMany(Sale, { foreignKey: 'storeId' });
Sale.belongsTo(Store, { foreignKey: 'storeId' });

Product.hasMany(Sale, { foreignKey: 'productId' });
Sale.belongsTo(Product, { foreignKey: 'productId' });

export { sequelize, Retailer, Store, Product, Search, Sale };
